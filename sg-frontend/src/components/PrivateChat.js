import React, { useState, useEffect } from "react";
import "../css/GroupDetails.css";
import { Container, Col, Form, Button } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function PrivateChat() {
  const navigate = useNavigate();
  const { recipientId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [recipientData, setRecipientData] = useState({});
  const clientId = sessionStorage.getItem("clientId");

  // Generate a unique chatId based on clientId and recipientId
  const chatId =
    clientId > recipientId
      ? `${clientId}_${recipientId}`
      : `${recipientId}_${clientId}`;

  // Fetch recipient details
  const fetchRecipientDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3010/api/auth/getClient",
        { clientId: recipientId }
      );
      if (response.data.status === "success") {
        setRecipientData(response.data.clientDetails);
      } else {
        console.error(
          "Failed to fetch recipient details:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching recipient details:", error.message);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3010/chat/getMessages",
        { chatId }
      );
      if (response.data.status === "success") {
        setMessages(response.data.chatDetails);
      } else {
        console.error("Failed to fetch messages:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  // Create chat if it doesn't exist
  const createChatIfNeeded = async () => {
    try {
      // Check if the chat already exists
      const response = await axios.post(
        "http://localhost:3010/chat/getMessages",
        { chatId }
      );
      if (response.data.status == "Not Found") {
        // If chat doesn't exist, create a new one
        await axios.post("http://localhost:3010/chat/createChat", {
          id: chatId,
          isGroup: false, // false because it's a private chat
        });
        fetchMessages(); // Fetch messages after creating chat
      } else {
        fetchMessages(); // Fetch messages if chat already exists
      }
    } catch (error) {
      console.error("Error handling chat creation:", error.message);
    }
  };

  // Send a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const newMessage = {
        messageId: Date.now().toString(),
        senderId: clientId,
        senderName:
          sessionStorage.getItem("firstName") +
          " " +
          sessionStorage.getItem("lastName"),
        text: messageInput.trim(),
        timestamp: new Date().toISOString(),
      };

      // Update messages locally
      setMessages([...messages, newMessage]);
      setMessageInput("");

      // Send to backend
      try {
        await axios.post("http://localhost:3010/chat/updateMessages", {
          chatId,
          newMessage,
        });
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchRecipientDetails();
    createChatIfNeeded(); // Ensure chat is created or fetched
  }, [chatId]);

  return (
    <>
      <NavigationBar />
      <div className="outerContainer">
        <Container fluid className="app-container">
          <div className="chatRow">
            {/* Left Side: Recipient Details */}
            <Col md={4} className="group-details">
              <h4>
                {recipientData?.firstName} {recipientData?.lastName}
              </h4>
              <div className="text-center">
                <img
                  src={
                    recipientData?.profilePicture ||
                    "https://via.placeholder.com/200"
                  }
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "200px", height: "200px" }}
                />
              </div>
              <p className="mt-3">
                <b>Department: </b> {recipientData?.department || "Unknown"}
              </p>
              <p>
                <b>Year of Study: </b> {recipientData?.yearOfStudy || "Unknown"}
              </p>
              <p>
                <b>Interests: </b> {recipientData?.interests || "Unknown"}
              </p>
              <Button
                variant="dark"
                className="back-button"
                onClick={() => {
                  navigate("../dashboard");
                }}
              >
                Back
              </Button>
            </Col>

            {/* Right Side: Chat */}
            <Col md={8} className="chat-box">
              <div className="chat-messages">
                {messages?.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.senderId === clientId ? "self" : "other"
                    }`}
                  >
                    <p>
                      <strong>
                        {msg.senderId === clientId ? "" : msg.senderName}
                      </strong>
                      {msg.senderId !== clientId && <br />}
                      {msg.text}
                    </p>
                    <small>{new Date(msg.timestamp).toLocaleString()}</small>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <Form onSubmit={handleSendMessage} className="chat-input-form">
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="chat-input"
                />
                <Button type="submit" variant="dark" className="send-button">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </Form>
            </Col>
          </div>
        </Container>
      </div>
    </>
  );
}

export default PrivateChat;
