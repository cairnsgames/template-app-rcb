import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const PARTNER_ROLES = [
  { id: 26, name: "Teacher" },
  { id: 27, name: "DJ" },
  { id: 28, name: "Venue" },
  { id: 29, name: "Event Coordinator" },
  { id: 30, name: "Supplier" },
];

export default function SearchFilterModal({
  show,
  onHide,
  selectedTypes,
  toggleType,
  selectedRoles,
  toggleRole,
  clearFilters,
}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Search Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Types</Form.Label>
            <div>
              <Form.Check
                type="checkbox"
                id="filter-news"
                label="News"
                checked={selectedTypes?.has("news")}
                onChange={() => toggleType("news")}
              />
              <Form.Check
                type="checkbox"
                id="filter-events"
                label="Events"
                checked={selectedTypes?.has("event")}
                onChange={() => toggleType("event")}
              />
              <Form.Check
                type="checkbox"
                id="filter-classes"
                label="Classes"
                checked={selectedTypes?.has("class")}
                onChange={() => toggleType("class")}
              />
            </div>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Partner Roles (multi-select)</Form.Label>
            <div>
              {PARTNER_ROLES.map((r) => (
                <Form.Check
                  key={r.id}
                  type="checkbox"
                  id={`role-${r.id}`}
                  label={r.name}
                  checked={Array.isArray(selectedRoles) && selectedRoles.includes(r.id)}
                  onChange={() => toggleRole(r.id)}
                />
              ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={() => {
            if (typeof clearFilters === "function") clearFilters();
          }}
        >
          Clear
        </Button>
        <Button variant="primary" onClick={onHide}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
