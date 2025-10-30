// index.js (backend)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import connectDB from "./db.js";
import youtubeRoutes from "./routes/youtube.js";
import AuthRoute from "./routes/AuthRoute.js";
import RoomRoute from "./routes/RoomRoute.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Main server start ✅");
});

app.use("/auth", AuthRoute);
app.use("/api", youtubeRoutes);
app.use("/room", RoomRoute);

// ---------- SOCKET.IO SETUP ----------
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// In-memory maps
const usersBySocket = new Map(); // socket.id -> { roomId, email }
const rooms = new Map(); // roomId -> [ { socketId, email } ]

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // ============ JOIN ROOM ============
  socket.on("join-room", ({ roomId, email }) => {
    if (!roomId || !email) {
      console.warn("❌ join-room missing params");
      return;
    }

    console.log(`➡️ ${email} (${socket.id}) requested to join room ${roomId}`);

    if (!rooms.has(roomId)) rooms.set(roomId, []);
    let userList = rooms.get(roomId);

    // clean stale entries
    userList = userList.filter((u) => u.socketId !== socket.id && u.email !== email);

    // add this user
    const newUser = { socketId: socket.id, email };
    userList.push(newUser);
    rooms.set(roomId, userList);
    usersBySocket.set(socket.id, { roomId, email });

    socket.join(roomId);

    // notify this user about existing members
    const otherUsers = userList.filter((u) => u.socketId !== socket.id);
    console.log(`📤 Sending all-users to ${socket.id}:`, otherUsers.map((o) => o.socketId));
    socket.emit("all-users", { users: otherUsers });

    // wait for join-ready
    socket.once("join-ready", () => {
      console.log(`✅ ${email} ready in ${roomId}, notifying others`);
      socket.to(roomId).emit("user-joined", newUser);
    });

    console.log(`✅ ${email} joined room ${roomId}`);
  });

  // ============ SIGNAL EXCHANGE ============
  socket.on("signal", ({ to, signal }) => {
    if (!to || !signal) return;
    console.log(`🔁 Forwarding signal from ${socket.id} → ${to}`);
    io.to(to).emit("signal", { from: socket.id, signal });
  });

  // ============ CHAT MESSAGE ============
  // Expect frontend to emit: socket.emit("chatMessage", { id, sender, text, ts })
  socket.on("chatMessage", (msg) => {
    // find the room of the sender and broadcast to that room
    const meta = usersBySocket.get(socket.id);
    if (!meta?.roomId) {
      console.warn("chatMessage: sender not in a room", socket.id);
      return;
    }
    io.to(meta.roomId).emit("chatMessage", msg);
  });

  // ============ LEAVE ROOM ============
  socket.on("leave-room", ({ roomId }) => {
    if (!roomId) return;
    handleLeave(socket, roomId);
  });

  socket.on("renegotiate-all", () => {
    socket.broadcast.emit("renegotiate", { from: socket.id });
  });

  socket.on("user-screen-sharing", ({ email }) => {
    socket.broadcast.emit("user-screen-sharing", email);
  });

  socket.on("user-stopped-sharing", () => {
    socket.broadcast.emit("user-stopped-sharing");
  });

  // ============ DISCONNECT ============
  socket.on("disconnect", () => {
    const meta = usersBySocket.get(socket.id);
    if (meta?.roomId) {
      handleLeave(socket, meta.roomId);
    }
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });

  // ============ HELPER: LEAVE HANDLER ============
  function handleLeave(socket, roomId) {
    const meta = usersBySocket.get(socket.id);
    usersBySocket.delete(socket.id);
    socket.leave(roomId);

    if (rooms.has(roomId)) {
      const updated = rooms.get(roomId).filter((u) => u.socketId !== socket.id);
      if (updated.length > 0) {
        rooms.set(roomId, updated);
      } else {
        rooms.delete(roomId);
      }
    }

    console.log(`📢 Broadcasting user-left (${socket.id}) in room ${roomId}`);
    socket.to(roomId).emit("user-left", { socketId: socket.id });
  }
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
