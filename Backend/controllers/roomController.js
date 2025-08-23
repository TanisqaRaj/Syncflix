import { v4 as uuidv4 } from "uuid";
import Room from "../models/Room.js";

// Create Room
export const createRoom = async (req, res) => {
  try {
    const { createdBy } = req.body;

    if (!createdBy) {
      return res.status(400).json({ message: "createdBy is required" });
    }

    const roomId = uuidv4(); // generate unique ID

    const newRoom = await Room.create({ roomId, createdBy });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      roomId: newRoom.roomId
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating room", error: error.message });
  }
};

// Join Room
export const joinRoom = async (req, res) => {
  try {
    const { roomId, email } = req.body;

    if (!roomId || !email) {
      return res.status(400).json({ message: "roomId and email are required" });
    }

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({
      success: true,
      message: `Joined room ${roomId} successfully`
    });
  } catch (error) {
    res.status(500).json({ message: "Error joining room", error: error.message });
  }
};
