import React from "react";
import HighlightText from "../../components/highlighttext";
import { Button, Col, Row } from "react-bootstrap";
import FloatingCard from "../../components/react-bootstrap-mobile/floatingcard";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { formatEventDate, formatPrice } from "./eventfunctions";

const EventCard = ({ item, onClick }) => {
  const overlayText = item?.overlay_text === "Y" ?? false;

  console.log("EventCard", item);

  return (
    <Col xs={12} md={6} lg={4}>
      <FloatingCard
        className="m-3"
        image={combineUrlAndPath(process.env.REACT_APP_FILES, `${item.image}`)}
        onClick={() => onClick(item)}
      >
        {overlayText && (
          <>
            <FloatingCard.Header>
              <h1>{item.title}</h1>
            </FloatingCard.Header>
            <FloatingCard.Body>
              <HighlightText text={item.keywords} />
            </FloatingCard.Body>
            <FloatingCard.Footer>
              <Row className="event-card-meta" style={{ fontSize: "0.8rem" }}>
                <Col xs={8} className="text-start">
                  {formatEventDate(item.start_time, item.end_time)}
                </Col>
                <Col xs={4} className="text-end">
                  {formatPrice(item.currency, item.price)}
                </Col>
              </Row>

              {item.enable_bookings && (
                <Button variant="primary" className="mt-3">
                  Book Now
                </Button>
              )}
            </FloatingCard.Footer>
          </>
        )}
      </FloatingCard>
    </Col>
  );
};

export default EventCard;
