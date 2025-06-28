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
  console.log("Kloko Event Detail", id, activeEvent);

  useEffect(() => {
    console.log("Setting Event ID", id);
    if (id) {
      setEventId(id);
    }
  }, []);

  const handleHomeRedirect = () => {
    window.location.hash = "#home";
  };

  if (!activeEvent) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  console.log("Active event", activeEvent);
  return (
    <div className="px-3 py-2" style={{ margin: "1rem", marginLeft: "auto", marginRight: "auto", maxWidth: "100%" }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h2 className="m-0">{activeEvent.title}</h2>
        <button
          className="btn btn-outline-secondary"
          onClick={handleHomeRedirect}
        >
          X
        </button>
      </div>

      <Tracker itemtype="event.detail" id={activeEvent.id}>
        <Card className="news-item">
          <Card.Img
            variant="top"
            src={combineUrlAndPath(process.env.REACT_APP_FILES, activeEvent.image)}
            style={{ height: "100%", width: "100%", maxHeight: "50vh", objectFit: 'contain' }}
            className="m-3"
          />
          <Card.Body>
            {activeEvent.description}
            {/* <div>Price: {formatPrice(activeEvent.currency, activeEvent.price)}</div> */}
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
    </div>
  );
};

export default KlokoEventDetail;
