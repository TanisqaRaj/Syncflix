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
  res.send("Main server start");
});

app.use("/auth", AuthRoute);
app.use("/api", youtubeRoutes);
app.use("/room", RoomRoute);

// WebSocket server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


const usersBySocket = new Map(); 
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, email }) => {
    if (!roomId || !email) return;

    if (!rooms.has(roomId)) rooms.set(roomId, []);

    let userList = rooms.get(roomId);

    // Prevent duplicate join
    const alreadyJoined = userList.some((u) => u.email === email);
    if (!alreadyJoined) {
      userList.push({ socketId: socket.id, email });
      rooms.set(roomId, userList);
    }

    socket.join(roomId);
    usersBySocket.set(socket.id, { roomId, email });

    // send list of existing users to the new user
    const others = userList.filter((u) => u.socketId !== socket.id);
    socket.emit("all-users", { users: others });

    // notify others in room
    socket.to(roomId).emit("user-joined", { socketId: socket.id, email });

    console.log(`${email} joined room ${roomId}`);
  });

  socket.on("signal", ({ to, signal }) => {
    io.to(to).emit("signal", { from: socket.id, signal });
  });

  socket.on("leave-room", ({ roomId }) => {
    handleLeave(socket, roomId);
  });

  socket.on("disconnect", () => {
    const meta = usersBySocket.get(socket.id);
    if (meta?.roomId) {
      handleLeave(socket, meta.roomId);
    }
    console.log("User disconnected:", socket.id);
  });

  function handleLeave(socket, roomId) {
    socket.leave(roomId);

    usersBySocket.delete(socket.id);

    if (rooms.has(roomId)) {
      const updated = rooms.get(roomId).filter((u) => u.socketId !== socket.id);

      if (updated.length > 0) {
        rooms.set(roomId, updated);
      } else {
        rooms.delete(roomId);
      }
    }

    socket.to(roomId).emit("user-left", { socketId: socket.id });
  }
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
