import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const server = createServer(app);

const connections = new Map();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("setClient", (data) => {
    const { clientId } = data;
    connections.set(clientId, socket.id);
    socket.emit("notify", { message: "You are now Online" });
  });

  socket.on("setGroups", (data) => {
    const { groupDetails } = data;
    groupDetails.forEach((group) => socket.join(group.id));
  });

  socket.on("groupMessage", (data) => {
    const { groupId } = data;
    io.to(groupId).emit("groupNotification", data);
  });

  socket.on("privateMessage", (data) => {
    const { recipientId, message } = data;
    const targetSocketId = connections.get(recipientId);

    if (targetSocketId) {
      io.to(targetSocketId).emit("privateReply", data);
    } else {
      console.error("Recipient not connected:", recipientId);
    }
  });

  socket.on("disconnect", () => {
    for (const [key, value] of connections.entries()) {
      if (value === socket.id) {
        connections.delete(key);
        break;
      }
    }
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3011;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
