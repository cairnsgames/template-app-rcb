import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const LandingPage = () => {
  return (
    <Container fluid className="text-center">
      {/* Hero Section */}
      <Row className="hero-section bg-primary text-white py-5">
        <Col>
          <h1>Welcome to Podcast Maker</h1>
          <p>Generate scripts and voices for your podcast using AI!</p>
          <Button variant="light" size="lg">Join Waiting List</Button>
        </Col>
      </Row>

      {/* Benefits Section */}
      <Row className="benefits-section py-5">
        <Col>
          <h2>Benefits</h2>
          <ul className="list-unstyled">
            <li>AI-generated scripts tailored to your needs</li>
            <li>High-quality voice generation</li>
            <li>Easy-to-use interface</li>
            <li>Flexible pricing plans</li>
          </ul>
        </Col>
      </Row>

      {/* Pricing Section */}
      <Row className="pricing-section py-5">
        <Col>
          <h2>Pricing</h2>
          <ul className="list-unstyled">
            <li>Basic Plan: $10/month</li>
            <li>Pro Plan: $20/month</li>
            <li>Enterprise Plan: Contact us for pricing</li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;
