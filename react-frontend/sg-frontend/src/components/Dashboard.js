import React, { useState } from 'react';
import { Container, Navbar, Nav, Form, FormControl, Button, Offcanvas, Row, Col } from 'react-bootstrap';

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div>
      {/* Top Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          <Button variant="primary" onClick={toggleSidebar}>
            Launch
        </Button>

          {/* Logo and Search Bar */}
          <Navbar.Brand href="#">Dashboard</Navbar.Brand>

          {/* Search Bar (Centered) */}
          <Nav className="mx-auto">
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
            </Form>
          </Nav>
          
          {/* Profile Picture */}
          <div className="ms-3">
            <img
              src="https://via.placeholder.com/40" // Placeholder image URL for profile picture
              alt="Profile"
              className="rounded-circle"
              style={{ width: '40px', height: '40px' }}
            />
          </div>
        </Container>
      </Navbar>

      {/* Sidebar (Offcanvas from the left) */}
      <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Sidebar</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav defaultActiveKey="/" className="flex-column">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">Settings</Nav.Link>
            <Nav.Link href="#">Messages</Nav.Link>
            <Nav.Link href="#">Notifications</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <Container>
        <Row>
          <Col md={12}>
            <h2>Welcome to the Dashboard!</h2>
            <p>Here’s some content for the main area.</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
