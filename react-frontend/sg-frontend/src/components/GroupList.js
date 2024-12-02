import React, { useState } from "react";
import { Button, Modal, Form, ListGroup, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../css/GroupList.css";
import NavigationBar from "./NavigationBar";

const groupData = [
  {
    id: 1,
    name: "Study Group - Math",
    time: "3:00 PM",
    date: "Dec 5, 2024",
    location: "Library Room 202",
    members: 8,
    subject: "Mathematics",
  },
  {
    id: 2,
    name: "Coding Bootcamp",
    time: "10:00 AM",
    date: "Dec 7, 2024",
    location: "Tech Hub Room 12",
    members: 15,
    subject: "Programming",
  },
  {
    id: 3,
    name: "Yoga Class",
    time: "6:00 AM",
    date: "Dec 6, 2024",
    location: "Recreation Center",
    members: 10,
    subject: "Wellness",
  },
];

const GroupList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filteredChats, setFilteredChats] = useState(groupData);
  const [filteredGroups, setFilteredGroups] = useState(groupData);
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
      group.name.toLowerCase().includes(term)
    );
    setFilteredChats(filtered);
  };

  return (
    <>
      <NavigationBar />
      <div className="grouplist-container">
        <div className="grouplist-box">
          <div className="filter-container">
            <InputGroup className="search-bar1">
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
                      <div className="group-name">{group.name}</div>
                      <div className="group-meta">
                        <span>
                          {group.time} | {group.date}
                        </span>
                        <span>{group.location}</span>
                        <span>Members: {group.members}</span>
                        <span>Subject: {group.subject}</span>
                      </div>
                    </div>

                    <Button variant="dark col-3 join-button">Join</Button>
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
