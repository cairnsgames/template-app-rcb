import React, { useEffect, useState } from "react";
import FavoriteIcon from "./FavoriteIcon";
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

  return (
    <div className="" style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "100%" }}>
      <div className="mb-3">
        <h2 className="m-0">{activeEvent.title}</h2>
        {/* <button
          className="btn btn-outline-secondary"
          onClick={handleHomeRedirect}
        >
          X
        </button>*/}
      </div> 

      <Tracker itemtype="event.detail" id={activeEvent.id}>
        <Card className="news-item">
          {/* Image with Favorite Star Button overlay */}
          <div style={{ position: "relative" }}>
            <Card.Img
              variant="top"
              src={combineUrlAndPath(process.env.REACT_APP_FILES, activeEvent.image)}
              style={{ height: "100%", width: "100%", maxHeight: "50vh", objectFit: 'contain' }}
              className=""
            />
            <FavoriteIcon
              event_id={activeEvent.id}
              favorite={activeEvent.favorite}
              style={{ position: "absolute", top: 24, right: 32, zIndex: 2 }}
            />
          </div>
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
                    
