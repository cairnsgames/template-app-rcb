import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Search, Plus } from "react-bootstrap-icons";

const DesktopSearch = ({ searchQuery, setSearchQuery, setIsAddModalOpen }) => {
  return (
    <div className="d-none d-md-block bg-white border-bottom">
      <Row className="align-items-center px-3 py-2 mt-3">
        <Col>
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-4"
            />
            <Search className="position-absolute top-50 translate-middle-y ms-2" size={16} />
          </div>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            className="d-flex align-items-center gap-1"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={20} />
            <span>Add Class</span>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DesktopSearch;
