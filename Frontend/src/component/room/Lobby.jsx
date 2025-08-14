import React, { useState } from "react";
import axios from "axios";

const Lobby = () => {
  const [roomId, setRoomId] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [email, setEmail] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState("");

// Create Room
const createRoom = async () => {
  try {
    const res = await axios.post("http://localhost:8080/room/create");
    if (res.data.success) {
      alert(`Room Created! ID: ${res.data.roomId}`);
    }
  } catch (err) {
    console.error(err);
  }
};

// Join Room
const joinRoom = async () => {
  if (!joinRoomId || !email) {
    alert("Please enter both Room ID and Email");
    return;
  }
  try {
    const res = await axios.post("http://localhost:8080/room/join", {
      roomId: joinRoomId,
      email,
    });

    if (res.data.success) {
      socket.emit("join-room", { roomId: joinRoomId, email });
      navigate(`/room/${joinRoomId}`, { state: { roomId: joinRoomId, email } });
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error("Error joining room:", err);
    alert("Error joining room");
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg space-y-8">
        
        {/* Create Room Section */}
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">Create Room</h2>
          <button
            onClick={createRoom}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Room
          </button>
          {createdRoomId && (
            <p className="text-green-600 font-semibold">
              Room Created! ID: {createdRoomId}
            </p>
          )}
        </div>

        <hr />

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={joinRoom}
            className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
