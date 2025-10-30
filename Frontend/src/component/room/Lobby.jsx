import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import socket from "../../socket";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Lobby = () => {
  const [roomId, setRoomId] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState("");
  const navigate = useNavigate();

  // Create Room
  const createRoom = async () => {
    try {
      const res = await axios.post(
        "https://syncflix-79x2.onrender.com/room/create",
        {
          createdBy: email,
        }
      );
      // If backend returned success, join the created room and navigate
      if (res.data.success) {
        const newRoomId = res.data.roomId;
        setCreatedRoomId(newRoomId);

        // Creator should join the room via socket and navigate to the room page
        socket.emit("join-room", { roomId: newRoomId, email });
        navigate(`/room/${newRoomId}`, { state: { email } });
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  const joinRoom = async () => {
    try {
      const res = await axios.post(
        "https://syncflix-79x2.onrender.com/room/join",
        {
          roomId: joinRoomId,
          email: email2,
        }
      );

      if (res.data.success) {
        // Emit socket event to join room
        socket.emit("join-room", { roomId: joinRoomId, email: email2 });

        // navigate(`/room/${joinRoomId}`, { state: { roomId: joinRoomId, email } });
        navigate(`/room/${joinRoomId}`, { state: { email: email2 } });
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Error joining room:", err);
    }
  };

  useEffect(() => {
    const handleUserJoined = (payload) => {
      const joinedEmail = payload?.email || payload?.createdBy || "Someone";
      console.log(`🔔 ${joinedEmail} joined the room`);
      alert(`${joinedEmail} joined the room`);
    };

    socket.on("user-joined", handleUserJoined);

    return () => {
      socket.off("user-joined", handleUserJoined);
    };
  }, []);

  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-5">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black backdrop-blur-xl shadow-2xl rounded-3xl p-6 w-full max-w-2xl space-y-6  transition-all duration-300">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Syncflix Meet
          </h1>
          <p className="text-gray-400 text-sm">
            Create or join a room to start your meeting
          </p>
        </div>

        {/* Create Room Section */}
        <div className="space-y-3 text-center border border-gray-800 rounded-2xl px-6 py-4 hover:border-blue-600 transition">
          <h2 className="text-2xl font-semibold">Create Room</h2>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          />
          <button
            onClick={createRoom}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md"
          >
            Create Room
          </button>
          {createdRoomId && (
            <p className="text-blue-400 font-medium animate-pulse">
              Room Created! ID:{" "}
              <span className="text-white">{createdRoomId}</span>
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center space-x-3">
          <div className="w-1/3 border-t border-gray-700"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="w-1/3 border-t border-gray-700"></div>
        </div>

        {/* Join Room Section */}
        <div className="space-y-6 border border-gray-800 rounded-2xl px-6 py-4 hover:border-blue-600 transition">
          <h2 className="text-2xl font-semibold text-center">Join Room</h2>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            className="w-full p-2 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          />
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email2}
            onChange={(e) => setEmail2(e.target.value)}
            className="w-full p-2 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          />
          <button
            onClick={joinRoom}
            className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-all shadow-md"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
