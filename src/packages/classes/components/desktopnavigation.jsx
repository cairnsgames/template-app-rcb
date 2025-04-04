import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { format } from "date-fns";

const DesktopNavigation = ({ weekDays, navigateWeek }) => {
  return (
    <div className="d-none d-md-block bg-white border-bottom">
      <Row className="align-items-center px-3 py-2">
        <Col xs="auto">
          <Button variant="link" className="p-0" onClick={() => navigateWeek("prev")}>
            <ChevronLeft size={20} />
          </Button>
        </Col>
        <Col className="text-center fw-medium">
          {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
        </Col>
        <Col xs="auto">
          <Button variant="link" className="p-0" onClick={() => navigateWeek("next")}>
            <ChevronRight size={20} />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DesktopNavigation;
