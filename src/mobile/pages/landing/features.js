import React from "react";
import { Row, Col } from "react-bootstrap";
import { Search, Heart, Ticket, InfoCircle, CurrencyDollar } from "react-bootstrap-icons";

const Features = () => {
  return (
    <div>
      <h2 className="pb-2">Features</h2>
      <Row className="g-4 pb-5" xs={1} md={2} lg={3}>
        <Col>
          <div className="d-flex align-items-center mb-2">
            <div className="feature-icon bg-primary p-3">
              <Search color="white" size="24" />
            </div>
            <h3 className="mb-0 ms-3">Easily find Classes & Events</h3>
          </div>
          <p>Discover and book dance classes or events in your area with just a few clicks.</p>
        </Col>
        <Col>
          <div className="d-flex align-items-center mb-2">
            <div className="feature-icon bg-primary p-3">
              <Heart color="white" size="24" />
            </div>
            <h3 className="mb-0 ms-3">Join Loyalty Programs</h3>
          </div>
          <p>Earn rewards and discounts by joining our venue partners' loyalty programs.</p>
        </Col>
        <Col>
          <div className="d-flex align-items-center mb-2">
            <div className="feature-icon bg-primary p-3">
              <Ticket color="white" size="24" />
            </div>
            <h3 className="mb-0 ms-3">Use Your Mobile as a Ticket</h3>
          </div>
          <p>Seamlessly access events using your mobile phone as your ticket.</p>
        </Col>
        <Col>
          <div className="d-flex align-items-center mb-2">
            <div className="feature-icon bg-primary p-3">
              <InfoCircle color="white" size="24" />
            </div>
            <h3 className="mb-0 ms-3">Get the Latest News</h3>
          </div>
          <p>Stay updated with the latest dance news and announcements from your favorite vendors.</p>
        </Col>
        <Col>
          <div className="d-flex align-items-center mb-2">
            <div className="feature-icon bg-primary p-3">
              <CurrencyDollar color="white" size="24" />
            </div>
            <h3 className="mb-0 ms-3">Buy Dance Merchandise</h3>
          </div>
          <p>Shop for dance-related merchandise directly from our site.</p>
        </Col>
      </Row>
    </div>
  );
};

export default Features;
