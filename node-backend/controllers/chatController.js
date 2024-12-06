const clientModel = require("../models/clientModel");
const groupModel = require("../models/groupModel");
const chatModel = require("../models/chatModel");
const { v4: uuidv4 } = require("uuid");

exports.createChat = async (req, res) => {
  const { id, isGroup } = req.body;
  const ChatObject = {
    chatId: id,
    isGroupChat: isGroup,
    chatName: "",
    participants: [],
    messages: [
      {
        messageId: uuidv4(),
        senderId: "admin",
        text: "Welcome to the Group Chat",
        timestamp: new Date(),
      },
    ],
  };

  try {
    // Save new groupchat data
    await chatModel.addChatGroup(ChatObject);

    res.status(201).json({
      message: "Chat started created successfully",
      id,
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
