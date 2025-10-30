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
      const res = await axios.post("http://localhost:8080/room/create", {
        createdBy: email,
      });
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

  // Create Room
  // const createRoom = async () => {
  //   try {
  //     const res = await axios.post("http://localhost:8080/room/create", {
  //       createdBy: email
  //     });

  //     if (res.data.success) {
  //       const newRoomId = res.data.roomId;
  //       setCreatedRoomId(newRoomId);

  //       // Creator also joins the room
  //       socket.emit("join-room", { roomId: newRoomId, email });

  //       // Navigate to room
  //       // navigate(`/room/${newRoomId}`, { state: { email } });
  //     } else {
  //       alert(res.data.message);
  //     }
  //   } catch (err) {
  //     console.error("Error creating room:", err);
  //   }
  // };

  const joinRoom = async () => {
    try {
      const res = await axios.post("http://localhost:8080/room/join", {
        roomId: joinRoomId,
        email: email2,
      });

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg space-y-8 items-center">
      
        {/* Create Room Section */}
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">Create Room</h2>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createRoom}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Room
          </button>
          {createdRoomId && (
            <p className="text-gray-900 font-semibold">
              Room Created! ID: {createdRoomId}
            </p>
          )}
        </div>
        {/* Join Room Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Join Room</h2>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            className="w-full p-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email2}
            onChange={(e) => setEmail2(e.target.value)}
            className="w-full p-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={joinRoom}
            className="w-full px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-900 transition"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;

