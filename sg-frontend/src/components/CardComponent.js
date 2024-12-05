import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import { useNavigate } from "react-router-dom";

function GroupCard(props) {
  const navigate = useNavigate();
  return (
    <Card style={{ minWidth: "300px" }}>
      <Card.Body>
        <Card.Title>Group Name</Card.Title>
        <Card.Text>Group Description...</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Date Time</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Link
          onClick={() => {
            navigate("/groupDetails");
          }}
        >
          View Details
        </Card.Link>
      </Card.Body>
    </Card>
  );
}

export default GroupCard;
