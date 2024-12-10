import React, { useState } from "react";
import {
  Container,
  Navbar,
  Button,
  Offcanvas,
  Nav,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [notifications] = useState([
    "New message from John",
    "Meeting scheduled at 3 PM",
    "Reminder: Submit your project",
  ]);

  // Toggle sidebar visibility
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  // Notification Popover
  const notificationPopover = (
    <Popover id="notification-popover">
      <Popover.Header as="h3">Notifications</Popover.Header>
      <Popover.Body>
        {notifications.length > 0 ? (
          <ul className="list-unstyled mb-0">
            {notifications.map((notification, index) => (
              <li key={index} className="mb-2">
                {notification}
              </li>
            ))}
          </ul>
        ) : (
          <p>No new notifications</p>
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          {/* Sidebar Toggle Button */}
          <Button onClick={toggleSidebar} variant="outline-light">
            <FontAwesomeIcon icon={faBars} size="lg" />
          </Button>

          {/* Logo */}
          <Navbar.Brand
            className="ms-3 fw-bold"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Studious
          </Navbar.Brand>

          {/* Notification Icon & Profile Picture */}
          <div className="ms-auto d-flex align-items-center gap-3">
            <Button
              variant="outline-light"
              onClick={() => {
                sessionStorage.clear();
                navigate("/");
              }}
            >
              Logout
            </Button>
            {/* Notification Icon with Popover */}
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={notificationPopover}
              rootClose
            >
              <Button variant="outline-light" className="rounded-circle">
                <FontAwesomeIcon icon={faBell} size="lg" />
              </Button>
            </OverlayTrigger>

            {/* Profile Picture */}
            <img
              src="https://via.placeholder.com/40" // Replace with dynamic image URL
              alt="Profile"
              className="rounded-circle"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
        </Container>
      </Navbar>

      {/* Sidebar Offcanvas */}
      <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Studious</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav defaultActiveKey="/" className="flex-column">
            <Nav.Link onClick={() => navigate("/dashboard")}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate("/joinGroup")}>Groups</Nav.Link>
            <Nav.Link onClick={() => navigate("/conversations")}>Messages</Nav.Link>
            <Nav.Link onClick={() => navigate("/connectionSearch")}>Connect with People</Nav.Link>
            <Nav.Link onClick={() => navigate("/friendRequests")}>Friend Requests</Nav.Link> {/* New Link */}
            <Nav.Link onClick={() => navigate("/profile")}>Profile</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default NavigationBar;
