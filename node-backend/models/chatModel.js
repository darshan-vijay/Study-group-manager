const firestore = require("../firestore");
const CHATS_COLLECTION = "chats";

// Add a new chat group to the Firestore collection
exports.addChatGroup = async (chatObject) => {
  const chatRef = firestore.collection(CHATS_COLLECTION).doc(chatObject.chatId);
  await chatRef.set(chatObject);
};

// Get a chat by its chatId
exports.getChatById = async (chatId) => {
  const chatRef = firestore.collection(CHATS_COLLECTION).doc(chatId);
  const chatDoc = await chatRef.get();

  if (!chatDoc.exists) {
    return null;
  }

  return chatDoc.data();
};

// Add a new message to the messages array of a specific chat
exports.addMessageToChat = async (chatId, messageObject) => {
  const chatRef = firestore.collection(CHATS_COLLECTION).doc(chatId);

  // Use a Firestore transaction to ensure atomicity
  return firestore.runTransaction(async (transaction) => {
    const chatDoc = await transaction.get(chatRef);

    if (!chatDoc.exists) {
      return null;
    }

    const chatData = chatDoc.data();
    chatData.messages.push(messageObject); // Add the new message to the messages array

    // Update the chat document with the new messages array
    transaction.update(chatRef, { messages: chatData.messages });

    return chatData;
  });
};
