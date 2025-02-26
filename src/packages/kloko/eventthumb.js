import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { formatEventDate } from "./eventfunctions";
import Tracker from "../tracker/tracker";

const EventThumb = ({ event, onClick, onEdit }) => {
  const [imageLoaded, setImageLoaded] = useState(true); // State to track image loading

  const clickOnCard = () => {
    if (onClick) {
      onClick(event.id);
    }
  }

  return (  
    
    <Tracker itemtype="event.card" id={event.id}>
    <Card className="mb-3 pt-1 pb-2" onClick={clickOnCard}>
      <Card.Title className="m-1 ms-0">{event.title}</Card.Title>
      <Card.Body className="d-flex m-0 p-0">
        {imageLoaded && (
          <img
            src={combineUrlAndPath(process.env.REACT_APP_FILES, event.image)}
            alt="Event"
            style={{ maxWidth: "25%", marginRight: "15px", height: "auto", objectFit: "cover" }}
            onError={() => setImageLoaded(false)} // Set to false if image fails to load
          />
        )}
        <div>
          <Card.Text>
            <strong>Start Time:</strong>{" "}
            {formatEventDate(event.start_time, event.end_time)}
            <br />
            <strong>Location:</strong> {event.location}
            <br />
            <strong>Max Participants:</strong> {event.max_participants}
          </Card.Text>
        </div>
      </Card.Body>
      {onEdit && (
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
      )}
    </Card>
    </Tracker>
  );
};

export default EventThumb;
