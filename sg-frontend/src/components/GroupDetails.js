import React, { useState, useEffect, useRef } from "react";
import "../css/GroupDetails.css";
import { Container, Col, Form, Button, ListGroup } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSocket } from "./SocketContext";

function GroupDetails() {
  const socket = useSocket();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState({});
  const [groupMembers, setGroupMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const clientId = sessionStorage.getItem("clientId");
  const chatMessagesRef = useRef(null); // Ref for chat messages container

  // Scroll to the bottom of the chat panel
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  // Fetch group details and messages
  const fetchGroupDetails = async () => {
    try {
      // Fetch group details
      const response = await axios.post(
        "http://localhost:3010/api/auth/getGroupDetails",
        { groupId }
      );

      if (response.data.status === "success") {
        setGroupData(response.data.groupDetails);
        fetchMemberData(response.data.groupDetails.members);
      } else {
        console.error("Failed to fetch group details: ", response.data.message);
      }

      // Fetch messages
      const messageResponse = await axios.post(
        "http://localhost:3010/chat/getMessages",
        { chatId: groupId }
      );

      if (messageResponse.data.status === "success") {
        setMessages(messageResponse.data.chatDetails);
      } else {
        console.error(
          "Failed to fetch messages: ",
          messageResponse.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching group details or messages:", error.message);
    }
  };

  // Fetch group members
  const fetchMemberData = async (clients) => {
    try {
      const response = await axios.post(
        "http://localhost:3010/api/auth/getClients",
        { clients }
      );

      if (response.data.status === "success") {
        setGroupMembers(response.data.clientDetails);
      } else {
        console.error("Failed to fetch members: ", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching members:", error.message);
    }
  };

  // Send a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const newMessage = {
        messageId: Date.now().toString(),
        senderId: sessionStorage.getItem("clientId"),
        senderName:
          sessionStorage.getItem("firstName") +
          " " +
          sessionStorage.getItem("lastName"),
        text: messageInput.trim(),
        timestamp: new Date().toISOString(),
      };
      setMessageInput("");
      socket.emit("groupMessage", {
        groupId: groupId,
        groupName: groupData.groupName,
        message: newMessage,
      });
      // Send to backend
      try {
        await axios.post("http://localhost:3010/chat/updateMessages", {
          chatId: groupId,
          newMessage,
        });
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  useEffect(() => {
    const handleGroupNotification = (data) => {
      if (data.groupId === groupId) {
        setMessages((messages) => [...messages, data.message]);
      }
    };

    socket.on("groupNotification", handleGroupNotification);

    // Clean up the listener when the component unmounts or groupId changes
    return () => {
      socket.off("groupNotification", handleGroupNotification);
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom whenever messages are updated
  }, [messages]);

  return (
    <>
      <NavigationBar groupId={groupId} />
      <div className="outerContainer">
        <Container fluid className="app-container">
          <div className="chatRow">
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
                    {client?.firstName} {client?.lastName}
                    <Button
                      variant="dark"
                      className="rounded-circle send-button"
                      onClick={() =>
                        navigate(`../privateChat/${client.id}`, {
                          state: { client },
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button
                variant="dark"
                className="back-button"
                onClick={() => navigate("../dashboard")}
              >
                Back
              </Button>
            </Col>

            {/* Right Side: Chat */}
            <Col md={8} className="chat-box">
              <div
                className="chat-messages"
                ref={chatMessagesRef} // Attach ref to the messages container
              >
                {messages?.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.senderId === sessionStorage.getItem("clientId")
                        ? "self"
                        : "other"
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

export default GroupDetails;
