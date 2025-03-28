// chatRoutes.js

const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Route to create a new chat
router.post("/create-chat", chatController.createChat);

// Route to fetch all messages of a chat by chatId
router.post("/get-messages", chatController.getMessages);

// Route to update the messages array of a specific chat by chatId
router.post("/update-messages", chatController.updateMessages);

module.exports = router;
