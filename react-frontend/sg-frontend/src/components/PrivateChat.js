import React, { useState } from "react";
import "../css/GroupDetails.css";
import { Container, Col, Form, Button } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";

function PrivateChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { text: "Hello, how are you?", type: "other" },
    { text: "I'm good, thanks! How about you?", type: "self" },
  ]);
  const groupMembers = ["Darshan", "Ganesha", "Ruban", "Satish"];

  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      setMessages([...messages, { text: messageInput, type: "self" }]);
      setMessageInput("");
    }
  };

  return (
    <>
      <NavigationBar></NavigationBar>
      <div className="outerContainer">
        <Container fluid className="app-container">
          <div class="chatRow">
            {/* Left Side: Group Details */}
            <Col md={4} className="group-details">
              <h4>Darshan</h4>
              <div className="text-center">
                <img
                  src="https://via.placeholder.com/40" // Replace with dynamic image URL
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "200px", height: "200px" }}
                />
              </div>
              <p className="mt-3">
                <b>Department: </b> Computer Science
              </p>
              <p>
                <b>Year of Study: </b> Graduate
              </p>
              <p>
                <b>Interests: </b> CS
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
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.type === "self" ? "self" : "other"
                    }`}
                  >
                    {msg.text}
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
                  Send
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
