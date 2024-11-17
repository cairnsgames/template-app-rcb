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
import useEvents from "./context/useevents";

const KlokoEvents = () => {
  const { events, fetchEvents, loading } = useEvents();
  const [sortOption, setSortOption] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showOldEvents, setShowOldEvents] = useState(false); // State for showing old events

  console.log("Kloko Events: Events", events);

  const handleSort = (option) => {
    if (sortOption === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortOrder("asc");
    }
  };

  const sortedEvents = events.sort((a, b) => {
    const compareValue = sortOrder === "asc" ? 1 : -1;

    if (sortOption === "title") {
      return a.title.localeCompare(b.title) * compareValue;
    } else if (sortOption === "start_time") {
      return (new Date(a.start_time) - new Date(b.start_time)) * compareValue;
    }
    return 0;
  });

  // Filter events based on the showOldEvents state
  const filteredEvents = sortedEvents.filter(
    (event) => showOldEvents || new Date(event.start_time) >= new Date()
  );

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
        <Col>
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
          <EventThumb
            key={event.id}
            event={event}
          />
        ))}
      </Row>
    </div>
  );
};

export default KlokoEvents;
