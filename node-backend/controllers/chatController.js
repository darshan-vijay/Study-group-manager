const chatModel = require("../models/chatModel");
const { v4: uuidv4 } = require("uuid");

// Create a new chat
exports.createChat = async (req, res) => {
  const { id, isGroup } = req.body;
  const chatName = isGroup ? "Group Chat" : "Private Chat";
  const ChatObject = {
    chatId: id,
    isGroupChat: isGroup,
    chatName: chatName,
    participants: [],
    messages: [
      {
        messageId: uuidv4(),
        senderId: "admin",
        senderName: "Admin",
        text: `Welcome to ${chatName}`,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    await chatModel.addChatGroup(ChatObject);
    res.status(201).json({
      message: "Chat created successfully",
      id,
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all messages of a chat by chatId
exports.getMessages = async (req, res) => {
  const { chatId } = req.body;

  try {
    const chatDetails = await chatModel.getChatById(chatId);

    if (!chatDetails) {
      return res.status(200).json({
        status: "Not Found",
      });
    }

    res.status(200).json({
      message: "Messages fetched successfully",
      status: "success",
      chatDetails: chatDetails.messages,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update the messages array of a particular chatId
exports.updateMessages = async (req, res) => {
  const { chatId, newMessage } = req.body;
  const messageObject = {
    messageId: uuidv4(),
    ...newMessage,
  };

  try {
    const updatedChat = await chatModel.addMessageToChat(chatId, messageObject);

    if (!updatedChat) {
      return res
        .status(404)
        .json({ message: "Chat not found", status: "error" });
    }

    res.status(200).json({
      message: "Message updated successfully",
      status: "success",
      updatedChat,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
