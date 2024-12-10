import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  // Log when the component is mounted
  useEffect(() => {
    console.log("FriendRequests component mounted.");
  }, []);

  // Fetch friend requests when the component is mounted
  useEffect(() => {
    console.log("Fetching friend requests...");
    fetchFriendRequests();
  }, []);
  
  const fetchFriendRequests = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3010/api/auth/get-pending-requests",
        {
          clientId: sessionStorage.getItem("clientId"),
        }
      );
      console.log("API Response:", response.data);
      if (response.data.status === "success") {
        setFriendRequests(response.data.friendRequests);
      } else {
        console.error("Failed to fetch friend requests: ", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error.message);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const clientId = sessionStorage.getItem("clientId"); // Retrieve clientId
      await axios.post("http://localhost:3010/api/auth/accept-friend-request", { requestId, clientId });
      fetchFriendRequests(); // Refresh the list
    } catch (error) {
      console.error("Error accepting friend request:", error.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const clientId = sessionStorage.getItem("clientId"); // Retrieve clientId
      await axios.post("http://localhost:3010/api/auth/reject-friend-request", { requestId, clientId });
      fetchFriendRequests(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting friend request:", error.message);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Friend Requests</h2>
          {friendRequests.length === 0 ? (
            <p>No pending friend requests.</p>
          ) : (
            friendRequests.map((request) => (
              <div key={request.id} className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <strong>{request.senderName}</strong> <br />
                  <span>{request.senderEmail}</span>
                </div>
                <div>
                  <Button
                    variant="success"
                    onClick={() => handleAccept(request.id)}
                    className="me-2"
                  >
                    Accept
                  </Button>
                  <Button variant="danger" onClick={() => handleReject(request.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FriendRequests;
