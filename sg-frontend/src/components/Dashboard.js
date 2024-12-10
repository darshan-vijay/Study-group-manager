import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../css/Dashboard.css";
import { useNavigate } from "react-router-dom";
import GroupCard from "./CardComponent";
import NavigationBar from "./NavigationBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faUsers,
  faAddressBook,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSocket } from "./SocketContext";

const Dashboard = () => {
  const socket = useSocket();
  const [groups, setGroups] = useState([]);
  const getGroups = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3010/api/auth/getGroups",
        {
          clientId: sessionStorage.getItem("clientId"),
        }
      );
      if (response.data.status === "success") {
        setGroups(response.data.groupDetails);
        socket.emit("setGroups", { groupDetails: response.data.groupDetails });
      } else {
        setGroups([]);
        console.log("Group fetch failed: ", response.data.message);
      }
    } catch (error) {
      setGroups([]);
      console.error("Group fetch failed:", error.message);
    }
  };

  useEffect(() => {
    getGroups();
    socket.emit("setClient", { clientId: sessionStorage.getItem("clientId") });
  }, []);

  const navigate = useNavigate();

  return (
    <div>
      {/* Top Bar */}
      <NavigationBar />
      {/* Main Content */}
      <Container>
        <Row>
          <Col md={12}>
            <h2>Welcome to Studious!</h2>
            <p>
              To get started, create your own study group or join a new one that
              already exists.
            </p>
          </Col>
        </Row>
        <Row>
          <div
            className="selection-button col-md-4 create-group-color"
            onClick={() => navigate("/createGroup")}
          >
            Create Group
            <FontAwesomeIcon icon={faSquarePlus} />
          </div>
          <div
            className="selection-button col-md-4 join-group-color"
            onClick={() => navigate("/joinGroup")}
          >
            Join Group
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div
            className="selection-button col-md-4 connect-color"
            onClick={() => navigate("/connectionSearch")}
          >
            Connect with People
            <FontAwesomeIcon icon={faAddressBook} />
          </div>
        </Row>
        <div className="mt-4">
          <h3>Upcoming Events</h3>
          <div className="group-row mt-2">
            {groups.map((group) => (
              <GroupCard
                key={group.id} // Assuming `id` is unique for each group
                groupDetails={group} // Pass the entire group object
                className="ms-3"
              />
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3>Important Links</h3>
          <div
            className="selection-button col-md-4"
            onClick={() => navigate("/conversations")}
          >
            Conversations
            <FontAwesomeIcon icon={faCommentDots} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
