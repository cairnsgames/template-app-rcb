import React, { useEffect, useState } from "react";
import useMyEvents from "./context/usemyevents";
import { Button, Card, Spinner } from "react-bootstrap";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { formatEventDate, formatPrice } from "./eventfunctions";
import BookingSection from "./klokobookingsection";

const KlokoEventDetail = ({ id }) => {
  const { myEvents } = useMyEvents();

  const [event, setEvent] = useState();

  useEffect(() => {
    const ev = myEvents.find((event) => event.id === Number(id));
    setEvent(ev);
  }, [myEvents, id]);

  if (!event) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Card className="news-item">
        <Card.Img
          variant="top"
          src={combineUrlAndPath(process.env.REACT_APP_FILES, event.image)}
          style={{ height: "100%", width: "100%" }}
        />
        <Card.Body>
          <Card.Title>{event.title}</Card.Title>
          {event.description}
          <div>Price: {formatPrice(event.currency, event.price)}</div>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">
            {formatEventDate(event.start_time, event.end_time)}
          </small>
        </Card.Footer>

        {event.enable_bookings && (
          <Card.Footer>
            <BookingSection event={event} />
          </Card.Footer>
        )}
      </Card>
    </>
  );
};

export default KlokoEventDetail;
