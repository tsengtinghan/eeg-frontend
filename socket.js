// socket.js
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5001", {
  transports: ["websocket"], // Use both websocket and polling transports
  autoConnect: false, // Initially disable autoConnect
});

export default socket;
