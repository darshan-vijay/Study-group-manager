import React, { useState } from "react";
import { Form, InputGroup, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import "../css/ChatList.css";
import NavigationBar from "./NavigationBar";

const chatData = [
  {
    id: 1,
    name: "Private Chat with John",
    type: "private",
    lastMessage: "Hey, how are you?",
  },
  {
    id: 2,
    name: "Group Chat - Family",
    type: "group",
    lastMessage: "Dinner plans for tonight?",
  },
  {
    id: 3,
    name: "Private Chat with Alice",
    type: "private",
    lastMessage: "Can we reschedule our meeting?",
  },
  {
    id: 4,
    name: "Group Chat - Work",
    type: "group",
    lastMessage: "Deadline extended by 2 days.",
  },
  {
    id: 5,
    name: "Private Chat with Bob",
    type: "private",
    lastMessage: "Don't forget to check the email!",
  },
  {
    id: 6,
    name: "Group Chat - Friends",
    type: "group",
    lastMessage: "Movie night tomorrow?",
  },
];

const ChatList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState(chatData);

  // Handle search input
  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = chatData.filter((chat) =>
      chat.name.toLowerCase().includes(term)
    );
    setFilteredChats(filtered);
  };

  return (
    <>
      <NavigationBar></NavigationBar>
      <div className="chatlist-container">
        <div className="chatlist-box">
          {/* Search Bar */}
          <InputGroup className="mb-4 search-bar">
            <Form.Control
              type="text"
              placeholder="Search Chats"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <InputGroup.Text onClick={handleSearch} className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
          </InputGroup>

          {/* Chat List */}
          <div className="chat-list-container">
            <ListGroup className="chat-list">
              {filteredChats.map((chat) => (
                <ListGroup.Item
                  key={chat.id}
                  className={`chat-item ${
                    chat.type === "group" ? "group-chat" : "private-chat"
                  }`}
                >
                  <div className="chat-details">
                    <div className="chat-name">{chat.name}</div>
                    <div className="chat-last-message">{chat.lastMessage}</div>
                  </div>
                  <FontAwesomeIcon icon={faCommentDots} className="chat-icon" />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatList;
