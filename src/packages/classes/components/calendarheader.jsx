import React from "react";
import { Calendar } from "react-bootstrap-icons";
import { Row, Col } from "react-bootstrap";

const CalendarHeader = () => {
  return (
    <header className="bg-primary text-white p-3">
      <Row className="align-items-center">
        <Col>
          <h1 className="h4 d-flex align-items-center gap-2">
            <Calendar size={24} />
            Class Schedule
          </h1>
        </Col>
      </Row>
    </header>
  );
};

export default CalendarHeader;
