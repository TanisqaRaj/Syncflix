import { io } from "socket.io-client";

const socket = io("https://syncflix-79x2.onrender.com", {
  transports: ["websocket"],
  withCredentials: false,
});

export default socket; 
