import React, { useState, useEffect, Suspense } from "react";
import {
  Button,
  DropdownButton,
  Dropdown,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import EventThumb from "./eventthumb"; // Assuming there's a component for displaying event thumbnails
import LoadingSpinner from "../../components/spinner/spinner";
import useMyEvents from "./context/usemyevents";

const KlokoEvents = () => {
  const { myEvents, fetchEvents, loading } = useMyEvents();
  const [sortOption, setSortOption] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showOldEvents, setShowOldEvents] = useState(false);

  const handleSort = (option) => {
    if (sortOption === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortOrder("asc");
    }
  };

  const sortedEvents = myEvents.sort((a, b) => {
    const compareValue = sortOrder === "asc" ? 1 : -1;

    if (sortOption === "title") {
      return a.title.localeCompare(b.title) * compareValue;
    } else if (sortOption === "start_time") {
      return (new Date(a.start_time) - new Date(b.start_time)) * compareValue;
    }
    return 0;
  });

  // Filter events based on the showOldEvents state
  const filteredEvents = sortedEvents.filter((event) => {
    if (event.id === 24) {
      console.log("Event", event, new Date(event.start_time) >= new Date() ||
      new Date(event.end_time) >= new Date());
    }
    return (
      showOldEvents ||
      new Date(event.start_time) >= new Date() ||
      new Date(event.end_time) >= new Date()
    );
  });

  const showEvent = (eventId) => {
    window.location.href = `#events/${eventId}`;
  }

  console.log("Kloko Events: Filtered Events", filteredEvents);

  if (loading) {
    return (
      <div>
        <LoadingSpinner animation="border" />
      </div>
    );
  }

  return (
    <div className="my-events">
      <Row className="mb-3">
        <Col xs={6} lg={6}>
          <DropdownButton
            id="sort-dropdown"
            title={`Sort`}
            onSelect={handleSort}
          >
            <Dropdown.Item eventKey="title">Title</Dropdown.Item>
            <Dropdown.Item eventKey="start_time">Start Time</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col>
          <Form.Check
            type="checkbox"
            label="Show Old Events"
            checked={showOldEvents}
            onChange={() => setShowOldEvents(!showOldEvents)}
          />
        </Col>
      </Row>
      <Row>
        {filteredEvents.map((event) => (
          <EventThumb key={event.id} event={event} onClick={showEvent} />
        ))}
      </Row>
    </div>
  );
};

export default KlokoEvents;
