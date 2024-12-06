// clientModel.js
const firestore = require("../firestore");
const CHATS_COLLECTION = "chats";

exports.addChatGroup = async (chatObject) => {
  const chatRef = firestore.collection(CHATS_COLLECTION).doc(chatObject.chatId);
  await chatRef.set(chatObject);
};
