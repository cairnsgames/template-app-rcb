import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const EventDetails = ({ 
  title, 
  setTitle, 
  description, 
  setDescription, 
  eventType, 
  setEventType, 
  maxParticipants, 
  setMaxParticipants 
}) => {
  return (
    <div className="border p-2 my-3">
      <h3>Event Details</h3>
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <InputGroup>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="eventType">
        <Form.Label>
          Event Keywords
          <br />
          <Form.Text className="text-muted">
            <small>Enter keywords to help users find the event</small>
          </Form.Text>
        </Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="maxParticipants">
        <Form.Label>
          Max Participants
          <br />
          <Form.Text className="text-muted">
          <small>How many people can you handle at the event</small>
          </Form.Text>
        </Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
          />
        </InputGroup>
      </Form.Group>
    </div>
  );
};

export default EventDetails;
