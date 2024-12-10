import React, { useState, useEffect, useRef } from "react";
import "../css/GroupDetails.css";
import { Container, Col, Form, Button } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSocket } from "./SocketContext";
import { v4 as uuidv4 } from "uuid";

function PrivateChat() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { recipientId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [recipientData, setRecipientData] = useState({});
  const clientId = sessionStorage.getItem("clientId");
  const chatMessagesRef = useRef(null);

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const chatId =
    clientId > recipientId
      ? `${clientId}_${recipientId}`
      : `${recipientId}_${clientId}`;

  const fetchRecipientDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3010/api/auth/get-client",
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

  const fetchMessages = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3010/chat/getMessages",
        { chatId }
      );
      if (response.data.status === "success") {
        setMessages(response.data.chatDetails || []);
      } else {
        console.error("Failed to fetch messages:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const createChatIfNeeded = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3010/chat/getMessages",
        { chatId }
      );
      if (response.data.status === "Not Found") {
        await axios.post("http://localhost:3010/chat/createChat", {
          id: chatId,
          isGroup: false,
        });
        fetchMessages();
      } else {
        fetchMessages();
      }
    } catch (error) {
      console.error("Error creating or fetching chat:", error.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const newMessage = {
        messageId: uuidv4(),
        senderId: clientId,
        senderName: `${sessionStorage.getItem(
          "firstName"
        )} ${sessionStorage.getItem("lastName")}`,
        text: messageInput.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages([...messages, newMessage]);
      setMessageInput("");

      socket.emit("privateMessage", {
        clientId,
        recipientId,
        message: newMessage,
      });

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
    const handlePrivateReply = (data) => {
      const currChatId =
        data.clientId > data.recipientId
          ? `${data.clientId}_${data.recipientId}`
          : `${data.recipientId}_${data.clientId}`;
      if (chatId === currChatId) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    };

    socket.on("privateReply", handlePrivateReply);

    return () => {
      socket.off("privateReply", handlePrivateReply);
    };
  }, [socket, chatId]);

  useEffect(() => {
    fetchRecipientDetails();
    createChatIfNeeded();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <NavigationBar />
      <div className="outerContainer">
        <Container fluid className="app-container">
          <div className="chatRow">
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
              <p>
                <b>Department:</b> {recipientData?.department || "Unknown"}
              </p>
              <p>
                <b>Year of Study:</b> {recipientData?.yearOfStudy || "Unknown"}
              </p>
              <p>
                <b>Interests:</b> {recipientData?.interests || "Unknown"}
              </p>
              <Button
                variant="dark"
                className="back-button"
                onClick={() => navigate("../dashboard")}
              >
                Back
              </Button>
            </Col>

            <Col md={8} className="chat-box">
              <div className="chat-messages" ref={chatMessagesRef}>
                {messages?.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.senderId === clientId ? "self" : "other"
                    }`}
                  >
                    <p>
                      <strong>
                        {msg.senderId !== clientId && msg.senderName}
                      </strong>
                      {msg.senderId !== clientId && <br />}
                      {msg.text}
                    </p>
                    <small>{new Date(msg.timestamp).toLocaleString()}</small>
                  </div>
                ))}
              </div>

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
