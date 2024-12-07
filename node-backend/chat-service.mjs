import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Redis from "ioredis";

// Initialize Express and HTTP server
const app = express();
const server = createServer(app);

// //Initialize Redis
// const redisHost = 'redis';
// const redisPort = 6379;
// const channel = 'socketChannel';

// const redis = new Redis({
//   host: redisHost, port: redisPort
// });

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost", // Allow frontend URL
    methods: ["GET", "POST"],
  },
});

let connections = new Map(); // Map to track user IDs and socket IDs

// redis.subscribe(channel, (err, count) => {
//   if (err) {
//     console.error("Failed to subscribe:", err);
//   } else {
//     console.log(`Subscribed to ${channel}, listening for messages...`);
//   }
// });

// redis.on("message", (channel, data) => {
//   const targetSocketId = connections.get(parseInt(data.receiver));
//   if (targetSocketId) {
//     io.sockets.sockets.get(targetSocketId).emit("message", data.message);
//   }
// });

// Handle Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  let userId = parseInt(socket.handshake.query.userId);
  // Store the userId and socket.id in the connections map
  connections.set(userId, socket.id);

  let room = parseInt(socket.handshake.query.room);
  socket.join(room);

  // Receive message from the client
  socket.on("message", async (data) => {
    console.log("Message received:", data);

    // Look up the target socket by userId (receiver)
    const targetSocketId = connections.get(parseInt(data.receiver));
    if (targetSocketId) {
      // Emit the message to the target socket
      io.sockets.sockets.get(targetSocketId).emit("message", data.message);
    } else {
      await redis.publish(channel, data);
      console.log(`Publishing for user: ${data.receiver}`);
    }
  });

  socket.on("group-message", async (data) => {
    console.log("Message Group:", data);
    io.to(parseInt(data.room)).emit("message", data.message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Cleanup the connections map on disconnection
    for (let [userId, socketId] of connections.entries()) {
      if (socketId === socket.id) {
        connections.delete(userId);
        console.log(`User ${userId} disconnected and removed from connections`);
        break;
      }
    }
  });
});

// Start server
const PORT = 3004;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
