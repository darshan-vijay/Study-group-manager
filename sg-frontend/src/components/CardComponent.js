import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router-dom";

function GroupCard({ groupDetails }) {
  const navigate = useNavigate();
  const { id, groupName, groupDescription, date, time, location, subject } =
    groupDetails; // Destructure the properties from groupDetails

  return (
    <Card style={{ minWidth: "300px" }}>
      <Card.Body>
        <Card.Title>{groupName}</Card.Title>
        <Card.Text>{groupDescription}</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>
          {date} {time}
        </ListGroup.Item>
        <ListGroup.Item>{location}</ListGroup.Item>
        <ListGroup.Item>{subject}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Link onClick={() => navigate(`/groupDetails/${id}`)}>
          View Group
        </Card.Link>
      </Card.Body>
    </Card>
  );
}

export default GroupCard;
