import React, { useState } from "react";
import { Container, Navbar, Nav, Button, Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../css/Dashboard.css"; // Ensure CSS file exists or remove the import.
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => setShowSidebar(!showSidebar);

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

          {/* Profile Picture */}
          <div className="ms-auto">
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
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">Groups</Nav.Link>
            <Nav.Link href="#">Messages</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default NavigationBar;
