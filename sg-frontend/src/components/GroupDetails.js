import React, { useState } from "react";
import "../css/GroupDetails.css";
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function GroupDetails() {
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
              <h4>Group Details</h4>
              <p>Name: Chat Group</p>
              <p>Members: 10</p>
              <p>Description: A simple chat group.</p>
              <ListGroup className="list-group-flush mt-2">
                {groupMembers.map((name, index) => (
                  <ListGroup.Item key={index} className="list-group-single">
                    {name}
                    <Button
                      variant="dark"
                      className="rounded-circle d-flex justify-content-center align-items-center send-button"
                      style={{ width: "40px", height: "40px" }}
                      onClick={() => {
                        navigate("../privateChat");
                      }}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
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

export default GroupDetails;
