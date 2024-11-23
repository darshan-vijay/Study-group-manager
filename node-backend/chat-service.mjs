import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Redis from 'ioredis';

// Initialize Express and HTTP server
const app = express();
const server = createServer(app);

//Initialize Redis
const redisHost = 'localhost';
const redisPort = 30079;
const channel = 'socketChannel';

const redis = new Redis({
  host: redisHost, port: redisPort
});

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow frontend URL
        methods: ["GET", "POST"]
    }
});

let connections = new Map();  // Map to track user IDs and socket IDs

redis.subscribe(channel, (err, count) => {
  if (err) {
    console.error('Failed to subscribe:', err);
  } else {
    console.log(`Subscribed to ${channel}, listening for messages...`);
  }
});

redis.on('message', (channel, data) => {
  const targetSocketId = connections.get(parseInt(data.receiver));
      if (targetSocketId) {
          io.sockets.sockets.get(targetSocketId).emit('message', data.message);
      }
});

// Handle Socket.IO connection
io.on('connection', (socket) => {

    console.log('A user connected:', socket.id);
    
    // Assign a unique userId (could replace this with a session ID or username in production)
    let userId = Math.floor(Math.random() * 100) + 1;

    // Store the userId and socket.id in the connections map
    connections.set(userId, socket.id);

    // Send the assigned userId back to the client
    socket.emit('assign', userId);

    // Receive message from the client
    socket.on('message', async (data) => {
        console.log('Message received:', data);
        
        // Look up the target socket by userId (receiver)
        const targetSocketId = connections.get(parseInt(data.receiver));
          if (targetSocketId) {
              // Emit the message to the target socket
              io.sockets.sockets.get(targetSocketId).emit('message', data.message);
          } else {
            await redis.publish(channel, data);
            console.log(`Publishing for user: ${data.receiver}`);
          }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

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
