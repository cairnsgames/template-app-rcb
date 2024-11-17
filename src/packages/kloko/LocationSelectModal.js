import React from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import SelectLocationModal from "../gps/selectlocationmodal";

const LocationSelectModal = ({ show, onHide, onSave, details, setDetails }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add/Edit Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formLocationName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location name"
              value={details.name}
              onChange={(ev) =>
                setDetails({ ...details, name: ev.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formAddressLine1">
            <Form.Label>Address Line 1</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address line 1"
              value={details.address_line1}
              onChange={(ev) =>
                setDetails({ ...details, address_line1: ev.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formAddressLine2">
            <Form.Label>Address Line 2</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address line 2"
              value={details.address_line2}
              onChange={(ev) =>
                setDetails({ ...details, address_line2: ev.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formTown">
            <Form.Label>Town</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter town"
              value={details.town}
              onChange={(ev) =>
                setDetails({ ...details, town: ev.target.value })
              }
            />
          </Form.Group>
          <InputGroup className="mb-3">
            <InputGroup.Text>Location</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="lat"
              value={details.lat}
              onChange={(ev) =>
                setDetails({ ...details, lat: ev.target.value })
              }
            />
            <Form.Control
              type="text"
              placeholder="lng"
              value={details.lng}
              onChange={(ev) =>
                setDetails({ ...details, lng: ev.target.value })
              }
            />

            <SelectLocationModal onSelectLocation={()=>{}}/>
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationSelectModal;
