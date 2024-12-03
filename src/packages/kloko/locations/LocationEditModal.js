import React from "react";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import SelectLocationModal from "../../gps/selectlocationmodal";

const LocationEditModal = ({ show, handleClose, details, setDetails, handleSave }) => {
  const selectLocation = (latlng) => {
    console.log("Selected location", latlng);
    setDetails({ ...details, lat: latlng[0], lng: latlng[1] });
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{details.id > 0 ? "Edit Location" : "Add Location"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formLocationName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location name"
              value={details.name}
              onChange={(ev) => setDetails({ ...details, name: ev.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formAddressLine1">
            <Form.Label>Address Line 1</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address line 1"
              value={details.address_line1}
              onChange={(ev) => setDetails({ ...details, address_line1: ev.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formAddressLine2">
            <Form.Label>Address Line 2</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address line 2"
              value={details.address_line2}
              onChange={(ev) => setDetails({ ...details, address_line2: ev.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formTown">
            <Form.Label>Town</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter town"
              value={details.town}
              onChange={(ev) => setDetails({ ...details, town: ev.target.value })}
            />
          </Form.Group>
          <InputGroup className="mb-3">
            <InputGroup.Text>Location</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="lat"
              value={details.lat}
              onChange={(ev) => setDetails({ ...details, lat: ev.target.value })}
            />
            <Form.Control
              type="text"
              placeholder="lng"
              value={details.lng}
              onChange={(ev) => setDetails({ ...details, lng: ev.target.value })}
            />
            <SelectLocationModal onSelectLocation={selectLocation} />
          </InputGroup>
          <Form.Group controlId="formShowOnMap">
            <Form.Check
              type="checkbox"
              label="Show on Map"
              checked={details.showonmap}
              onChange={(ev) => setDetails({ ...details, showonmap: ev.target.checked ? 1 : 0})}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationEditModal;
