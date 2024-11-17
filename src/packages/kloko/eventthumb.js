import React from "react";
import { Card, Button } from "react-bootstrap";
import { combineUrlAndPath } from "../../functions/combineurlandpath";

const EventThumb = ({ event, onClick, onEdit }) => {
  return (
    <Card className="mb-3" onClick={onClick}>
      <Card.Title>{event.title}</Card.Title>
      <Card.Body className="d-flex">
        <img
          src={combineUrlAndPath(process.env.REACT_APP_FILES, event.image)}
          alt="Event"
          style={{ maxWidth: "25%", marginRight: "15px" }}
        />
        <div>
          <Card.Text>
            <strong>Start Time:</strong>{" "}
            {new Date(event.start_time).toLocaleString()}
            <br />
            <strong>Location:</strong> {event.location}
            <br />
            <strong>Max Participants:</strong> {event.max_participants}
          </Card.Text>
        </div>
      </Card.Body>
      <Card.Footer>
        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          Edit
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default EventThumb;
