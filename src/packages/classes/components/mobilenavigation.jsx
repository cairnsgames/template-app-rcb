import React from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";
import { format } from "date-fns";

const MobileNavigation = ({
  searchQuery,
  setSearchQuery,
  setIsAddModalOpen,
  role,
  selectedDate,
  navigateDay,
}) => {
  return (
    <div className="bg-white border-bottom pt-2">
      {role === "dancer" ? (
        <Row className="align-items-center px-3 py-2">
          <Col xs="auto">
            <Button
              variant="light"
              className="rounded-circle p-2"
              onClick={() => setSearchQuery("")}
            >
              <ArrowLeft size={20} />
            </Button>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
        </Row>
      ) : (
        <Row className="align-items-center px-3 py-2">
          <Col xs="auto">
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigateDay("prev")}
            >
              <ChevronLeft size={20} />
            </Button>
          </Col>
          <Col className="text-center fw-medium">
            {format(selectedDate, "EEEE, MMM d, yyyy")}
          </Col>
          <Col xs="auto">
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigateDay("next")}
            >
              <ChevronRight size={20} />
            </Button>
          </Col>

          <Col xs="auto">
            <Button
              variant="light"
              className="rounded-circle p-2"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={20} />
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default MobileNavigation;
