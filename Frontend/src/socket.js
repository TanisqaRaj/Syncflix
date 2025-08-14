import { io } from "socket.io-client";

const socket = io("http://localhost:8080"); // or your deployed backend URL
export default socket;
