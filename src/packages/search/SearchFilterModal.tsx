import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import type { SearchFilterModalProps } from "./search.types";

const partnerRoles = [
  { id: 26, name: "Teacher" },
  { id: 27, name: "DJ" },
  { id: 28, name: "Venue" },
  { id: 29, name: "Event Coordinator" },
  { id: 30, name: "Supplier" },
];

const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  show,
  onHide,
  selectedTypes,
  toggleType,
  selectedRoles,
  toggleRole,
  clearFilters,
}) => {
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
                checked={selectedTypes.has("news")}
                onChange={() => toggleType("news")}
              />
              <Form.Check
                type="checkbox"
                id="filter-events"
                label="Events"
                checked={selectedTypes.has("event")}
                onChange={() => toggleType("event")}
              />
              <Form.Check
                type="checkbox"
                id="filter-classes"
                label="Classes"
                checked={selectedTypes.has("class")}
                onChange={() => toggleType("class")}
              />
            </div>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Partner Roles (multi-select)</Form.Label>
            <div>
              <Form.Check
                type="checkbox"
                id="role-all"
                label="All partners"
                checked={selectedRoles.includes("ALL_PARTNERS")}
                onChange={() => toggleRole("ALL_PARTNERS")}
              />
              <div style={{ paddingLeft: 18 }}>
                {partnerRoles.map((role) => (
                  <Form.Check
                    key={role.id}
                    type="checkbox"
                    id={`role-${role.id}`}
                    label={role.name}
                    checked={selectedRoles.includes(role.id) || selectedRoles.includes("ALL_PARTNERS")}
                    onChange={() => toggleRole(role.id)}
                  />
                ))}
              </div>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={clearFilters}>
          Clear
        </Button>
        <Button variant="primary" onClick={onHide}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchFilterModal;
