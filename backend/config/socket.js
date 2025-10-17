// socket.js
import { Server } from "socket.io";

let io; // store the io instance globally

// Initialize Socket.IO with the HTTP server
export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }, // allow all origins, adjust in production
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Get the initialized Socket.IO instance anywhere in your app
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
