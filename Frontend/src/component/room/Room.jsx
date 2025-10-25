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

// Small tile to render a peer stream
const RemoteVideo = ({ peer }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!peer) return;
    const onStream = (stream) => {
      if (ref.current) ref.current.srcObject = stream;
    };
    peer.on("stream", onStream);
    return () => {
      peer.off("stream", onStream);
    };
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

  // Local media
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  // Peers map in ref: socketId -> peer
  const peersRef = useRef(new Map());

  // UI toggles
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [sharing, setSharing] = useState(false);

  // ----- helpers -----
  const stopTracks = (stream) => stream?.getTracks()?.forEach((t) => t.stop());

  const createPeer = useCallback((remoteSocketId, stream, initiator) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream,
    });
    // when this peer generates signaling data, send to the other side
    peer.on("signal", (signal) => {
      socket.emit("signal", { to: remoteSocketId, signal });
    });
    peer.on("error", (err) => console.error("peer error", err));
    peer.on("close", () => {
      // clean up if needed
    });
    return peer;
  }, []);

  // ----- setup media + socket -----
  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        // 1) get camera/mic
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (!mounted) return;
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        // 2) tell redux room id
        dispatch(setRoomId(roomId));

        // 3) join room
        socket.emit("join-room", { roomId, email });

        // 4) get list of already connected users (socket ids)
        const handleAllUsers = ({ users }) => {
          // create a peer for each existing user (initiator: true)
          users.forEach((remoteId) => {
            dispatch(addUser({ socketId: remoteId, email: "peer" }));
            const peer = createPeer(remoteId, stream, true);
            peersRef.current.set(remoteId, peer);
          });
        };

        const handleUserJoined = ({ socketId, email: joinEmail }) => {
          // new user joined: we are NOT initiator
          dispatch(addUser({ socketId, email: joinEmail || "peer" }));
          const peer = createPeer(socketId, stream, false);
          peersRef.current.set(socketId, peer);
        };

        const handleSignal = ({ from, signal }) => {
          const peer = peersRef.current.get(from);
          if (peer) {
            peer.signal(signal);
          } else {
            // Edge case: peer not created yet (rare). Create as non-initiator.
            const p = createPeer(from, localStreamRef.current, false);
            peersRef.current.set(from, p);
            p.signal(signal);
          }
        };

        const handleUserLeft = ({ socketId }) => {
          const peer = peersRef.current.get(socketId);
          if (peer) {
            peer.destroy();
            peersRef.current.delete(socketId);
          }
          dispatch(removeUser(socketId));
        };

        socket.on("all-users", handleAllUsers);
        socket.on("user-joined", handleUserJoined);
        socket.on("signal", handleSignal);
        socket.on("user-left", handleUserLeft);

        // cleanup
        return () => {
          socket.off("all-users", handleAllUsers);
          socket.off("user-joined", handleUserJoined);
          socket.off("signal", handleSignal);
          socket.off("user-left", handleUserLeft);
        };
      } catch (e) {
        console.error("getUserMedia error", e);
      }
    };

    boot();
    return () => {
      mounted = false;
    };
  }, [roomId, email, dispatch, createPeer]);

  // ----- Controls -----
  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      localStreamRef.current
        ?.getAudioTracks()
        ?.forEach((t) => (t.enabled = !next));
      return next;
    });
  };

  const toggleVideo = () => {
    setVideoOff((v) => {
      const next = !v;
      localStreamRef.current
        ?.getVideoTracks()
        ?.forEach((t) => (t.enabled = !next));
      return next;
    });
  };

  const shareScreen = async () => {
    if (sharing) return; // already sharing
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      setSharing(true);

      // replace video track in *all* peers
      const screenTrack = screenStream.getVideoTracks()[0];
      peersRef.current.forEach((peer) => {
        const sender = peer._pc
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");
        if (sender) sender.replaceTrack(screenTrack);
      });

      // show local preview as screen
      if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;

      // when user stops sharing, revert back to camera
      screenTrack.onended = async () => {
        try {
          const camStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          localStreamRef.current = camStream;
          if (localVideoRef.current)
            localVideoRef.current.srcObject = camStream;

          const camTrack = camStream.getVideoTracks()[0];
          peersRef.current.forEach((peer) => {
            const sender = peer._pc
              .getSenders()
              .find((s) => s.track && s.track.kind === "video");
            if (sender) sender.replaceTrack(camTrack);
          });
        } finally {
          setSharing(false);
          stopTracks(screenStream);
        }
      };
    } catch (e) {
      console.error("share screen error", e);
    }
  };

  const leaveRoom = () => {
    // destroy peers
    peersRef.current.forEach((p) => p.destroy());
    peersRef.current.clear();

    // stop local media
    stopTracks(localStreamRef.current);

    // emit optional leave (server also handles disconnect)
    socket.emit("leave-room", { roomId });

    dispatch(resetRoom());
    navigate("/home", { replace: true });
  };

  // ----- UI -----
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top bar */}
      <div className="p-3 flex items-center justify-between bg-gray-800">
        <div className="font-semibold">Room: {roomId}</div>
        <div className="text-sm opacity-70">{email}</div>
      </div>

      {/* Video grid */}
      <div
        className="grid gap-3 p-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        {/* local video */}
        <div className="relative rounded-xl overflow-hidden bg-black h-[75vh]">
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

        {/* remote peers */}
        {Array.from(peersRef.current.values()).map((peer, idx) => (
          <div
            key={idx}
            className="relative rounded-xl overflow-hidden bg-black h-64"
          >
            <RemoteVideo peer={peer} />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-800 flex items-center justify-center gap-4">
        <button
          onClick={shareScreen}
          className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700"
        >
          {sharing ? "Sharing…" : "Share Screen"}
        </button>
        <button
          onClick={toggleMute}
          className="px-4 py-2 rounded-full bg-yellow-600 hover:bg-yellow-700"
        >
          {muted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={toggleVideo}
          className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700"
        >
          {videoOff ? "Video On" : "Video Off"}
        </button>
        <button
          onClick={leaveRoom}
          className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700"
        >
          Leave
        </button>
      </div>
    </div>
  );
}
