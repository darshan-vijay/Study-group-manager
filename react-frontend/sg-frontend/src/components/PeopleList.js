import React, { useState } from "react";
import { Button, Modal, Form, ListGroup, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSearch,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import "../css/PeopleList.css";
import NavigationBar from "./NavigationBar";

const peopleData = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    courseOfStudy: "Computer Science",
    yearOfStudy: "Senior",
    typeOfDegree: "Bachelor's",
    profilePicture: "https://via.placeholder.com/50",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    courseOfStudy: "Mechanical Engineering",
    yearOfStudy: "Junior",
    typeOfDegree: "Master's",
    profilePicture: "https://via.placeholder.com/50",
  },
  {
    id: 3,
    firstName: "Alice",
    lastName: "Johnson",
    courseOfStudy: "Mathematics",
    yearOfStudy: "Freshman",
    typeOfDegree: "Bachelor's",
    profilePicture: "https://via.placeholder.com/50",
  },
];

const PeopleList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPeople, setFilteredPeople] = useState(peopleData);

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = peopleData.filter(
      (person) =>
        person.firstName.toLowerCase().includes(term) ||
        person.lastName.toLowerCase().includes(term) ||
        person.courseOfStudy.toLowerCase().includes(term) ||
        person.typeOfDegree.toLowerCase().includes(term)
    );
    setFilteredPeople(filtered);
  };

  return (
    <>
      <NavigationBar />
      <div className="peoplelist-container">
        <div className="peoplelist-box">
          <div className="filter-container">
            <InputGroup className="search-bar1">
              <Form.Control
                type="text"
                placeholder="Search People"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <InputGroup.Text onClick={handleSearch} className="search-button">
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
            </InputGroup>
          </div>

          {/* People List */}
          <div className="people-list-container">
            <ListGroup className="people-list">
              {filteredPeople.map((person) => (
                <ListGroup.Item key={person.id} className="people-item">
                  <div className="people-details-container">
                    <img
                      src={person.profilePicture}
                      alt={`${person.firstName} ${person.lastName}`}
                      className="profile-picture"
                    />
                    <div className="people-details">
                      <div className="name">
                        {person.firstName} {person.lastName}
                      </div>
                      <div className="meta">
                        <span>Course: {person.courseOfStudy}</span>
                        <span>Year: {person.yearOfStudy}</span>
                        <span>Degree: {person.typeOfDegree}</span>
                      </div>
                    </div>
                    <button class="btn btn-dark rounded-circle connect-button">
                      <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>
                    </button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
    </>
  );
};

export default PeopleList;
