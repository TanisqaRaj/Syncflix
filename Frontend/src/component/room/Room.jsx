// frontend/src/room/Room.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Peer from "simple-peer";
import socket from "../../socket";
import {
  setRoomId,
  addUser,
  removeUser,
  resetRoom,
} from "../../redux/roomSlice";

// ---- Remote video tile (listens to peer 'stream') ----
const RemoteVideo = ({ peer }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!peer) return;
    const onStream = (stream) => {
      if (ref.current) ref.current.srcObject = stream;
    };
    peer.on("stream", onStream);
    return () => peer.off("stream", onStream);
  }, [peer]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      className="rounded-lg bg-black w-full h-full object-cover"
    />
  );
};

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "anonymous@user";

  const dispatch = useDispatch();
  const users = useSelector((s) => s.room.users);
  const usersRef = useRef(users);
  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  // Local media
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  // Map socketId -> peer
  // peersRef.current is a Map<socketId, peer>
  const peersRef = useRef(new Map());
  const [remotePeers, setRemotePeers] = useState([]);

  // UI toggles
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [sharing, setSharing] = useState(false);

  // chat message
  const [userName, setUserName] = useState("");
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [inputName, setInputName] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const stopTracks = (stream) => stream?.getTracks()?.forEach((t) => t.stop());

  // STUN only (replace/add TURN in prod)
  const peerIceConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const createPeer = useCallback(
    (remoteSocketId, stream, initiator) => {
      const opts = { initiator, trickle: false, config: peerIceConfig };
      if (stream) opts.stream = stream;

      let peer;
      try {
        peer = new Peer(opts);
      } catch (err) {
        console.error("Failed to construct Peer", {
          err,
          remoteSocketId,
          initiator,
        });
        // safe stub to avoid crashes
        peer = {
          on: () => {},
          off: () => {},
          destroy: () => {},
          signal: () => {},
          _pc: { getSenders: () => [] },
        };
      }

      peer.on("connect", () => console.log("Peer connect:", remoteSocketId));
      peer.on("error", (e) => console.error("Peer error:", remoteSocketId, e));
      peer.on("close", () => console.log("Peer close:", remoteSocketId));

      // send signaling via server
      peer.on("signal", (signal) => {
        socket.emit("signal", { to: remoteSocketId, signal });
      });

      // cleanup when peer closed
      peer.on("close", () => {
        peersRef.current.delete(remoteSocketId);
        setRemotePeers((prev) =>
          prev.filter((p) => p.socketId !== remoteSocketId)
        );
        dispatch(removeUser(remoteSocketId));
      });

      // forward 'stream' handled in RemoteVideo
      return peer;
    },
    [dispatch]
  );

  useEffect(() => {
    let mounted = true;
    const boot = async () => {
      dispatch(setRoomId(roomId));

      // handlers
      const handleAllUsers = ({ users }) => {
        if (!Array.isArray(users)) return;
        users.forEach(({ socketId, email: remoteEmail }) => {
          if (peersRef.current.has(socketId)) return;

          const peer = createPeer(
            socketId,
            localStreamRef.current || undefined,
            true
          );
          peersRef.current.set(socketId, peer);

          dispatch(addUser({ socketId, email: remoteEmail || "peer" }));
          setRemotePeers((prev) => {
            if (prev.some((r) => r.socketId === socketId)) return prev;
            return [...prev, { socketId, peer, email: remoteEmail || "peer" }];
          });
        });
      };

      const handleUserJoined = ({ socketId, email: joinEmail }) => {
        if (peersRef.current.has(socketId)) return;
        const peer = createPeer(
          socketId,
          localStreamRef.current || undefined,
          false
        );
        peersRef.current.set(socketId, peer);

        dispatch(addUser({ socketId, email: joinEmail || "peer" }));
        setRemotePeers((prev) => {
          if (prev.some((r) => r.socketId === socketId)) return prev;
          return [...prev, { socketId, peer, email: joinEmail || "peer" }];
        });
      };

      const handleSignal = ({ from, signal }) => {
        let peer = peersRef.current.get(from);
        if (!peer) {
          // create receiver peer if not present
          peer = createPeer(from, localStreamRef.current || undefined, false);
          peersRef.current.set(from, peer);
          setRemotePeers((prev) => {
            if (prev.some((r) => r.socketId === from)) return prev;
            return [...prev, { socketId: from, peer, email: "peer" }];
          });
        }
        try {
          peer.signal(signal);
        } catch (err) {
          console.error("Error signaling peer", { from, err });
        }
      };

      const handleUserLeft = ({ socketId }) => {
        const peer = peersRef.current.get(socketId);
        if (peer) peer.destroy();
        peersRef.current.delete(socketId);
        setRemotePeers((prev) => prev.filter((r) => r.socketId !== socketId));
        dispatch(removeUser(socketId));
      };

      // chat message from server
      const handleChatMessage = (data) => {
        setMessages((prev) => {
          // Prevent duplicate IDs if message repeats
          if (prev.some((m) => m.id === data.id)) return prev;
          return [...prev, data];
        });
      };

      socket.on("chatMessage", handleChatMessage);

      socket.on("all-users", handleAllUsers);
      socket.on("user-joined", handleUserJoined);
      socket.on("signal", handleSignal);
      socket.on("user-left", handleUserLeft);

      socket.on("renegotiate", ({ from }) => {
        const peer = peersRef.current.get(from);
        if (peer && peer._needsNegotiation) {
          try {
            peer._needsNegotiation();
          } catch (e) {
            console.warn("peer._needsNegotiation() failed:", e);
          }
        }
      });

      // Get local media BEFORE joining room
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (!mounted) return;
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        socket.emit("join-room", { roomId, email });
        socket.emit("join-ready");
      } catch (mediaErr) {
        console.warn(
          "getUserMedia denied or failed — joining without local media.",
          mediaErr
        );
        socket.emit("join-room", { roomId, email });
        socket.emit("join-ready");
      }

      // cleanup handlers when effect cleanup runs
      return () => {
        socket.off("all-users", handleAllUsers);
        socket.off("user-joined", handleUserJoined);
        socket.off("signal", handleSignal);
        socket.off("user-left", handleUserLeft);
        socket.off("renegotiate");
        socket.off("chatMessage");
      };
    };

    boot();

    return () => {
      mounted = false;
      peersRef.current.forEach((p) => {
        try {
          p.destroy();
        } catch (e) {}
      });
      peersRef.current.clear();
      stopTracks(localStreamRef.current);
    };
  }, [roomId, email, dispatch, createPeer]);

  // ---------------- CONTROLS ----------------

  // MUTE / UNMUTE
  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTracks = stream.getAudioTracks();
    if (!audioTracks.length) return;
    const track = audioTracks[0];
    track.enabled = !track.enabled;
    setMuted(!track.enabled);
    // no need to replace sender track — toggling enabled is sufficient
  };

  // TOGGLE VIDEO (enable/disable existing video track). If track missing, try to getOne.
  const toggleVideo = async () => {
    let stream = localStreamRef.current;
    if (!stream) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch (e) {
        console.error("Cannot access camera:", e);
        return;
      }
    }

    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length === 0) {
      console.warn("No video track present");
      return;
    }

    const videoTrack = videoTracks[0];
    // toggle enabled
    videoTrack.enabled = !videoTrack.enabled;
    setVideoOff(!videoTrack.enabled);

    // ensure peers see the change — replace sender with same track (enabled false/true)
    peersRef.current.forEach((peer, socketId) => {
      try {
        const sender = peer._pc
          ?.getSenders?.()
          .find((s) => s.track && s.track.kind === "video");
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
        // optionally trigger negotiation
        peer._needsNegotiation?.();
      } catch (err) {
        console.debug("replaceTrack (toggleVideo) failed:", err);
      }
    });
  };

  // SCREEN SHARE (start/stop)
  const shareScreen = async () => {
    if (!sharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];

        // update local preview
        if (localVideoRef.current)
          localVideoRef.current.srcObject = screenStream;

        // replace outgoing video sender for each peer
        // peersRef.current is Map<id, peer>
        peersRef.current.forEach((peer, socketId) => {
          try {
            const sender = peer._pc
              ?.getSenders?.()
              .find((s) => s.track && s.track.kind === "video");
            if (sender) sender.replaceTrack(screenTrack);
            peer._needsNegotiation?.();
            // option: notify server for renegotiate
            socket.emit("renegotiate", { to: socketId });
          } catch (err) {
            console.debug(
              "replaceTrack failed for peer during screen share:",
              err
            );
          }
        });

        setSharing(true);

        // when screen share stops, restore camera
        screenTrack.onended = () => {
          stopScreenShare();
        };
      } catch (e) {
        console.error("Error sharing screen:", e);
        setSharing(false);
      }
    } else {
      await stopScreenShare();
    }
  };

  // Stop screen share and restore camera track
  const stopScreenShare = async () => {
    try {
      const camStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = camStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = camStream;

      const camTrack = camStream.getVideoTracks()[0];
      peersRef.current.forEach((peer, socketId) => {
        try {
          const sender = peer._pc
            ?.getSenders?.()
            .find((s) => s.track && s.track.kind === "video");
          if (sender && camTrack) sender.replaceTrack(camTrack);
          peer._needsNegotiation?.();
          socket.emit("renegotiate", { to: socketId });
        } catch (err) {
          console.debug("replaceTrack to cam failed:", err);
        }
      });

      setSharing(false);
      setVideoOff(false); // camera available again
    } catch (err) {
      console.error("Error stopping screen share:", err);
    }
  };

  //Leave room
  const leaveRoom = () => {
    peersRef.current.forEach((p) => {
      try {
        p.destroy();
      } catch (e) {}
    });
    peersRef.current.clear();
    setRemotePeers([]);
    stopTracks(localStreamRef.current);
    socket.emit("leave-room", { roomId });
    dispatch(resetRoom());
    navigate("/home", { replace: true });
  };

  const uniquePeers = remotePeers.filter(
    (p, i, self) => i === self.findIndex((t) => t.socketId === p.socketId)
  );

  // format time for chat
  function formatTime(ts) {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  // handle name submit (chat)
  function handleNameSubmit(e) {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) return;
    // set locally
    setUserName(trimmed);
    setShowNamePopup(false);
    // optionally tell server of chat join if you want (not required)
    // socket.emit("chat-join", { roomId, name: trimmed });
  }

  // send chat message
  function sendMessage() {
    const t = text.trim();
    if (!t) return;
    const msg = {
      id: Date.now(),
      sender: userName || email,
      text: t,
      ts: Date.now(),
    };
    setMessages((m) => [...m, msg]);
    try {
      socket.emit("chatMessage", msg);
    } catch (err) {
      console.warn("Failed to emit chatMessage:", err);
    }
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex h-[90vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-inter">
      {/* ---------- LEFT SIDE: VIDEO SECTION ---------- */}
      <div className="flex flex-col w-2/3 border-r border-gray-800">
        {/* HEADER */}
        <div className="p-4 flex items-center justify-between bg-gray-950 shadow-md">
          <div className="font-semibold text-lg tracking-wide">
            Room: <span className="text-blue-400">{roomId}</span>
          </div>
          <div className="text-sm opacity-70 italic">{email}</div>
        </div>

        {/* VIDEO GRID */}
        <div
          className="grid gap-4 p-4 overflow-y-auto flex-1"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          <div className="relative rounded-2xl overflow-hidden bg-black shadow-lg h-64 border border-gray-800 hover:scale-[1.01] transition-transform duration-200">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-xs bg-black/60 px-2 py-1 rounded">
              You
            </div>
          </div>

          {uniquePeers.map(({ socketId, peer }) => (
            <div
              key={socketId}
              className="relative rounded-2xl overflow-hidden bg-black shadow-lg h-64 border border-gray-800 hover:scale-[1.01] transition-transform duration-200"
            >
              <RemoteVideo peer={peer} />
              <div className="absolute bottom-2 left-2 text-xs bg-black/60 px-2 py-1 rounded">
                {usersRef.current.find((u) => u.socketId === socketId)?.email ||
                  "Peer"}
              </div>
            </div>
          ))}
        </div>

        {/* CONTROL BUTTONS */}
        <div className="p-4 bg-gray-950 flex items-center justify-center gap-4 border-t border-gray-800">
          <button
            type="button"
            onClick={shareScreen}
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all shadow-md"
          >
            {sharing ? "Sharing…" : "Share Screen"}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="px-5 py-2.5 rounded-full bg-yellow-600 hover:bg-yellow-700 hover:scale-105 transition-all shadow-md"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            onClick={toggleVideo}
            className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all shadow-md"
          >
            {videoOff ? "Video On" : "Video Off"}
          </button>
          <button
            type="button"
            onClick={leaveRoom}
            className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 hover:scale-105 transition-all shadow-md"
          >
            Leave
          </button>
        </div>
      </div>

      {/* ---------- RIGHT SIDE: CHAT SECTION ---------- */}
      <div className="w-1/3 flex flex-col bg-gray-50 text-black">
        {showNamePopup ? (
          <div className="flex items-center justify-center flex-1">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md p-8 text-center border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">
                Enter your name
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Enter your name to start chatting.
              </p>
              <form onSubmit={handleNameSubmit} className="mt-5 space-y-4">
                <input
                  autoFocus
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full border text-black border-gray-300 rounded-lg px-4 py-2.5 outline-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-800 transition"
                  placeholder="Your name..."
                />
                <button
                  type="submit"
                  className="block w-full py-2 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:bg-gray-700 text-white font-medium shadow-md transition"
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full rounded-sm">
            {/* CHAT HEADER */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 bg-white shadow-md">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center text-white font-semibold">
                💬
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-gray-800">
                  Realtime Chat
                </div>
                <div className="text-xs text-gray-500">
                  Connected as{" "}
                  <span className="font-medium capitalize text-gray-700">
                    {userName}
                  </span>
                </div>
              </div>
            </div>

            {/* CHAT MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-100 to-gray-200 space-y-3 scroll-smooth">
              {messages.map((m) => {
                const mine = m.sender === (userName || email);
                return (
                  <div
                    key={m.id}
                    className={`flex ${
                      mine ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-sm leading-5 shadow ${
                        mine
                          ? "bg-gray-700 text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm"
                      } transition-all hover:scale-[1.02]`}
                    >
                      <div className="break-words whitespace-pre-wrap">
                        {m.text}
                      </div>
                      <div className="flex justify-between items-center mt-1 gap-10">
                        <div className="text-[11px] font-medium opacity-80">
                          {m.sender}
                        </div>
                        <div className="text-[11px] opacity-70">
                          {formatTime(m.ts)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CHAT INPUT */}
            <div className="px-4 py-3 border-t border-gray-300 bg-white shadow-inner">
              <div className="flex items-center justify-between gap-3 border border-gray-300 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-400 transition">
                <textarea
                  rows={1}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full resize-none px-3 py-3 text-sm text-gray-800 bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:bg-gray-700 px-5 py-2 rounded-full text-sm font-medium text-white shadow-md transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
