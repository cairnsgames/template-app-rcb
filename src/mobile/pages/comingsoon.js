import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Clock } from 'react-bootstrap-icons';
import './comingsoon.scss';

const ComingSoon = () => {
  return (
    <Container fluid className="coming-soon">
      <Row className="p-5 justify-content-center align-items-center text-center">
        <Col xs={12} md={8}>
          <div className="coming-soon-content">
            <Clock className="icon" size={50} />
            <h1 className="mt-3">Coming Soon</h1>
            <p className="mt-2">
              We are working hard to bring you something amazing. Stay tuned!
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ComingSoon;
