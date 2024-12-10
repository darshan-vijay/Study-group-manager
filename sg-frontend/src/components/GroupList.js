import React, { useState, useEffect } from "react";
import { Button, Modal, Form, ListGroup, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../css/GroupList.css";
import NavigationBar from "./NavigationBar";
import axios from "axios";

const GroupList = () => {
  const [groupData, setGroupData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filteredChats, setFilteredChats] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  // Toggle filter overlay
  const handleFilterToggle = () => setShowFilter(!showFilter);

  // Apply filters
  const applyFilter = () => {
    const filtered = groupData.filter((group) =>
      group.subject.toLowerCase().includes(selectedSubject.toLowerCase())
    );
    setFilteredGroups(filtered);
    handleFilterToggle();
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = groupData.filter((group) =>
      group.groupName.toLowerCase().includes(term)
    );
    setFilteredChats(filtered);
  };

  const fetchAllGroups = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3010/api/auth/getAllGroups"
      );

      if (response.data.status === "success") {
        console.log(response.data.groups);
        const groups = response.data.groups;
        setGroupData(groups);
        setFilteredGroups(groups); // Initialize filtered groups
        setFilteredChats(groups); // Initialize filtered chats
      } else {
        console.error("Failed to fetch Groups: ", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching Groups:", error.message);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      const response = await axios.post(
        "http://localhost:3010/api/auth/addMemberToGroup",
        {
          groupId: groupId,
          clientId: sessionStorage.getItem("clientId"),
        }
      );

      if (response.data.status === "success") {
        console.log(response.data.groups);
        const groups = response.data.groups;
        setGroupData(groups);
        setFilteredGroups(groups); // Initialize filtered groups
        setFilteredChats(groups); // Initialize filtered chats
      } else {
        console.error("Failed to fetch Groups: ", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching Groups:", error.message);
    }
  };

  useEffect(() => {
    fetchAllGroups();
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="grouplist-container">
        <div className="grouplist-box">
          <div className="filter-container">
            <InputGroup className="search-bar1">
              <Form.Control
                type="text"
                placeholder="Search Groups"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <InputGroup.Text onClick={handleSearch} className="search-button">
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
            </InputGroup>
            <Button className="filter-button" onClick={handleFilterToggle}>
              <FontAwesomeIcon icon={faFilter} /> Filter
            </Button>
          </div>

          {/* Group List */}
          <div className="group-list-container">
            <ListGroup className="group-list">
              {filteredGroups.map((group) => (
                <ListGroup.Item key={group.id} className="group-item">
                  <div className="group-details-container">
                    <div className="group-details1 col-9">
                      <div className="group-name">{group.groupName}</div>
                      <div className="group-meta">
                        <span>
                          {group.time} | {group.date}
                        </span>
                        <span>{group.location}</span>
                        <span>Members: {group.memberCount}</span>
                        <span>Subject: {group.subject}</span>
                      </div>
                    </div>

                    <Button
                      variant="dark col-3 join-button"
                      onClick={() => joinGroup(group.id)}
                    >
                      Join
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>

        {/* Filter Modal */}
        <Modal show={showFilter} onHide={handleFilterToggle}>
          <Modal.Header closeButton>
            <Modal.Title>Filter Groups</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="filterSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter subject to filter"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleFilterToggle}>
              Cancel
            </Button>
            <Button variant="primary" onClick={applyFilter}>
              Apply Filter
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default GroupList;
