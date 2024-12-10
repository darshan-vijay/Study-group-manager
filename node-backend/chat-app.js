import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

// Middleware
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Start Server
const server = createServer(app);

let connections = new Map();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend URL
    methods: ["GET", "POST"],
  },
});

// Handle Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  // let room = parseInt(socket.handshake.query.room);
  // socket.join(room);
  socket.on("setClient", async (data) => {
    let clientId = data.clientId;
    connections.set(clientId, socket.id);
    socket.emit("notify", { message: "You are now Online" });
  });

  socket.on("setGroups", async (data) => {
    let groups = data.groupDetails;
    groups.map((group) => {
      console.log(group.id);
      socket.join(group.id);
    });
  });

  socket.on("groupMessage", async (data) => {
    let { groupId } = data;
    console.log("Message to Room", groupId, " ", data);
    io.to(groupId).emit("groupNotification", data);
  });
});

const PORT = process.env.PORT || 3011;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
