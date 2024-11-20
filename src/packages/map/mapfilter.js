import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import useMapContext from "./context/usemapcontext";

const MapFilterModal = ({ show, onHide }) => {
  const { filters, setFilters } = useMapContext();

  const handleCategoryChange = (e) => {
    setFilters({
      ...filters,
      categories: { ...filters.categories, [e.target.name]: e.target.checked },
    });
  };

  const handleFilter = () => {
    // Implement filter logic here
    console.log(filters);
    onHide();
  };

  console.log("Filters", filters);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Filter Criteria</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="oldEvents">
            <Form.Check
              type="checkbox"
              label="Show old events"
              checked={filters.oldEvents}
              onChange={() =>
                setFilters({ ...filters, oldEvents: !filters.oldEvents })
              }
            />
          </Form.Group>
           <Form.Group controlId="dateRange">
            <Form.Label>Date Range</Form.Label>
              <Form.Control
                type="date"
                value={filters.dateRange.start}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, start: e.target.value },
                  })
                }
              />
              <Form.Control
                type="date"
                value={filters.dateRange.end}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, end: e.target.value },
                  })
                }
              />
          </Form.Group>
          <Form.Group>
            <Form.Label>Categories</Form.Label>
            {Object.keys(filters.categories).map((category) => (
              <Form.Check
                key={category}
                type="checkbox"
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                name={category}
                checked={filters.categories[category]}
                onChange={handleCategoryChange}
              />
            ))}
          </Form.Group>
          <Form.Group controlId="keywords">
            <Form.Label>Keywords</Form.Label>
            <Form.Control
              type="text"
              value={filters.keywords}
              onChange={(e) =>
                setFilters({ ...filters, keywords: e.target.value })
              }
              placeholder="Enter keywords"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleFilter}>
          Filter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MapFilterModal;
