import React, { useState } from "react";
import "../css/GroupDetails.css";
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState({});
  const [groupMembers, setGroupMembers] = useState([]);
  const [messages, setMessages] = useState([
    { text: "Hello, how are you?", type: "other" },
    { text: "I'm good, thanks! How about you?", type: "self" },
  ]);

  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      setMessages([...messages, { text: messageInput, type: "self" }]);
      setMessageInput("");
    }
  };

  const fetchGroupDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3010/api/auth/getGroupDetails", // Assuming this endpoint exists
        { groupId }
      );
      if (response.data.status === "success") {
        setGroupData(response.data.groupDetails);
        fetchMemberData(response.data.groupDetails.members);
      } else {
        console.error("Failed to fetch group details: ", response.data.message);
        setGroupData([]);
      }
    } catch (error) {
      console.error("Error fetching group details:", error.message);
      setGroupData([]);
    }
  };

  const fetchMemberData = async (clients) => {
    try {
      const response = await axios.post(
        "http://localhost:3010/api/auth/getClients", // Assuming this endpoint exists
        { clients: clients }
      );
      if (response.data.status === "success") {
        setGroupMembers(response.data.clientDetails);
      } else {
        console.error("Failed to fetch group details: ", response.data.message);
        setGroupData([]);
      }
    } catch (error) {
      console.error("Error fetching group details:", error.message);
      setGroupData([]);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  return (
    <>
      <NavigationBar></NavigationBar>
      <div className="outerContainer">
        <Container fluid className="app-container">
          <div class="chatRow">
            {/* Left Side: Group Details */}
            <Col md={4} className="group-details">
              <h4>Group Details</h4>
              <p>Name: {groupData?.groupName}</p>
              <p>Members: {groupData?.memberCount}</p>
              <p>Description: {groupData?.groupDescription}</p>
              <ListGroup className="list-group-flush mt-2">
                {groupMembers?.map((client) => (
                  <ListGroup.Item
                    key={client?.id}
                    className="list-group-single"
                  >
                    {client?.firstName}
                    {"  "} {client?.lastName}
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
