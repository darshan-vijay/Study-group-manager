import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../css/Dashboard.css";
import { useNavigate } from "react-router-dom";
import GroupCard from "./CardComponent";
import NavigationBar from "./NavigationBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const navigate = useNavigate();
  const Groups = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div>
      {/* Top Bar */}
      <NavigationBar></NavigationBar>
      {/* Main Content */}
      <Container>
        <Row>
          <Col md={12}>
            <h2>Welcome to Studious!</h2>
            <p>
              To get started create your own study group, or join a new one that
              already exists.
            </p>
          </Col>
        </Row>
        <Row>
          <div
            className="selection-button col-md-4 create-group-color"
            onClick={() => {
              navigate("/createGroup");
            }}
          >
            Create Group
          </div>
          <div
            className="selection-button col-md-4 join-group-color"
            onClick={() => {
              navigate("/joinGroup");
            }}
          >
            Join Group
          </div>
        </Row>
        <div className="mt-4">
          <h3>Upcoming Events</h3>

          <div className="group-row mt-2">
            {Groups.map((user) => (
              <GroupCard className="ms-3" />
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3>Important Links</h3>
          <div
            className="selection-button col-md-4"
            onClick={() => {
              navigate("/conversations");
            }}
          >
            Conversations
            <FontAwesomeIcon icon={faCommentDots} size="2x" />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
