import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const PARTNER_ROLES = [
  { id: 26, name: "Teacher" },
  { id: 27, name: "DJ" },
  { id: 28, name: "Venue" },
  { id: 29, name: "Event Coordinator" },
  { id: 30, name: "Supplier" },
];

export default function PartnerFilterModal({
  show,
  onHide,
  selectedRoles,
  toggleRole,
  clearFilters,
}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Partner Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Partner Roles (multi-select)</Form.Label>
            <div>
              <Form.Check
                type="checkbox"
                id="role-all"
                label="All partners"
                checked={Array.isArray(selectedRoles) && selectedRoles.includes("ALL_PARTNERS")}
                onChange={() => toggleRole("ALL_PARTNERS")}
              />
              <div style={{ paddingLeft: 18 }}>
                {PARTNER_ROLES.map((r) => (
                  <Form.Check
                    key={r.id}
                    type="checkbox"
                    id={`role-${r.id}`}
                    label={r.name}
                    checked={
                      Array.isArray(selectedRoles) &&
                      (selectedRoles.includes(r.id) || selectedRoles.includes("ALL_PARTNERS"))
                    }
                    onChange={() => toggleRole(r.id)}
                  />
                ))}
              </div>
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
