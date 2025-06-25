import React, { useEffect, useState } from "react";
import useMyEvents from "./context/usemyevents";
import { useEvents } from "./context/useevents";
import { Button, Card, Spinner } from "react-bootstrap";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { formatEventDate, formatPrice } from "./eventfunctions";
import BookingSection from "./klokobookingsection";
import Tracker from "../tracker/tracker";

const KlokoEventDetail = ({ id }) => {
  const { activeEvent, setEventId } = useEvents();
  
  useEffect(() => {
    if (id) {
      setEventId(id);
    }
  }, [id]);

  if (!activeEvent) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  console.log("Active event", activeEvent);
  return (
    
    <Tracker itemtype="event.detail" id={activeEvent.id}>
      <Card className="news-item">
        <Card.Img
          variant="top"
          src={combineUrlAndPath(process.env.REACT_APP_FILES, activeEvent.image)}
          style={{ height: "100%", width: "100%", maxHeight: "50vh", objectFit: 'contain' }}
        />
        <Card.Body>
          EVENT DETAIL
          <Card.Title>{activeEvent.title}</Card.Title>
          {activeEvent.description}
          <div>Price: {formatPrice(activeEvent.currency, activeEvent.price)}</div>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">
            {formatEventDate(activeEvent.start_time, activeEvent.end_time)}
          </small>
        </Card.Footer>

        {activeEvent.enable_bookings === "Y" && (
          <Card.Footer>
            <BookingSection event={activeEvent} />
          </Card.Footer>
        )}
      </Card>
    </Tracker>
  );
};

export default KlokoEventDetail;
