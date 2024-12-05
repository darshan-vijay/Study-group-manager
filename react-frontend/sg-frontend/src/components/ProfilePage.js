import React, { useState } from "react";
import { Card, Button, ListGroup, InputGroup, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faUserFriends,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "../css/ProfilePage.css";
import NavigationBar from "./NavigationBar";

const UserProfile = () => {
  const [signUpForm, setSignUpForm] = useState({
    email: "john.doe@example.com",
    password: "",
    confirmPassword: "",
    firstName: "John",
    lastName: "Doe",
    courseOfStudy: "Computer Science",
    yearOfStudy: "Senior",
    typeOfDegree: "Bachelor's",
    gender: "Male",
    profilePicture: "https://via.placeholder.com/100",
  });

  const friends = [
    {
      id: 1,
      name: "Jane Smith",
      profilePicture: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      name: "Alice Johnson",
      profilePicture: "https://via.placeholder.com/50",
    },
  ];

  const groups = [
    { id: 1, name: "CS Study Group" },
    { id: 2, name: "Hackathon Team" },
  ];

  return (
    <>
      <NavigationBar />
      <div className="user-profile-container">
        <Card className="profile-card">
          <div className="profile-header">
            <img
              src={signUpForm.profilePicture}
              alt={`${signUpForm.firstName} ${signUpForm.lastName}`}
              className="profile-picture"
            />
            <div className="profile-info">
              <h2>
                {signUpForm.firstName} {signUpForm.lastName}
              </h2>
              <p>
                <strong>Course of Study:</strong> {signUpForm.courseOfStudy}
              </p>
              <p>
                <strong>Year of Study:</strong> {signUpForm.yearOfStudy}
              </p>
              <p>
                <strong>Degree Type:</strong> {signUpForm.typeOfDegree}
              </p>
              <p>
                <strong>Gender:</strong> {signUpForm.gender}
              </p>
              <p>
                <strong>Email:</strong> {signUpForm.email}
              </p>
              <Button variant="primary">
                <FontAwesomeIcon icon={faEdit} /> Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        <div className="profile-sections">
          {/* Friends Section */}
          <Card className="friends-section">
            <Card.Header>
              <FontAwesomeIcon icon={faUserFriends} /> Friends
            </Card.Header>

            <div class="scroll-box">
              <ListGroup>
                {friends.map((friend) => (
                  <ListGroup.Item key={friend.id} className="friend-item">
                    <img
                      src={friend.profilePicture}
                      alt={friend.name}
                      className="friend-picture"
                    />
                    <span>{friend.name}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Card>

          {/* Groups Section */}
          <Card className="groups-section">
            <Card.Header>
              <FontAwesomeIcon icon={faUsers} /> Groups
            </Card.Header>
            <div class="scroll-box">
              <ListGroup>
                {groups.map((group) => (
                  <ListGroup.Item key={group.id} className="group-item">
                    {group.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
