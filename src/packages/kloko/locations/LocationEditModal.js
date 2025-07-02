import React from "react";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import SelectLocationModal from "../../gps/selectlocationmodal";

const LocationEditModal = ({ show, handleClose, details, setDetails, handleSave }) => {
  const selectLocation = (latlng) => {
    setDetails({ ...details, lat: latlng[0], lng: latlng[1] });
  }

  const setAddress = (address) => {
    console.log("Selected address - on modal:", address);
    const newDetails = {
      ...details,
      address_line1: address.street,
      town: address.city || address.town || address.village,
      country: address.country,
    };
    if (newDetails.name === "") {
      newDetails.name = address.street || address.city || address.town || address.village;
    }
    console.log("Updated details:", newDetails);
    setDetails(newDetails);
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
              value={details.name ?? ""}
              onChange={(ev) => setDetails({ ...details, name: ev.target.value })}
            />
          </Form.Group>
          <div className="mt-3">            
            <Form.Label>Select Location</Form.Label>
          </div>
          <InputGroup className="mb-3">
          
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
            <SelectLocationModal onSelectLocation={selectLocation} onSelectAddress={setAddress} />
            
          </InputGroup>
          {!details.lat && (
            <div className="text-muted mb-3">
              Please select a location above before setting the address.
            </div>
          )}
          <Form.Group controlId="formAddressLine1">
            <Form.Label>Address Line 1</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address line 1"
              value={details.address_line1 ?? ""}
              onChange={(ev) => setDetails({ ...details, address_line1: ev.target.value })}
              disabled={!details.lat}
            />
          </Form.Group>
          <Form.Group controlId="formAddressLine2">
            <Form.Label>Address Line 2</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address line 2"
              value={details.address_line2 ?? ""}
              onChange={(ev) => setDetails({ ...details, address_line2: ev.target.value })}
              disabled={!details.lat}
            />
          </Form.Group>
          <Form.Group controlId="formTown">
            <Form.Label>Town</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter town"
              value={details.town ?? ""}
              onChange={(ev) => setDetails({ ...details, town: ev.target.value })}
              disabled={!details.lat}
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
          </InputGroup>
          <Form.Group controlId="formShowOnMap">
            <Form.Check
              type="checkbox"
              label="Show on Map"
              checked={details.showonmap}
              onChange={(ev) => setDetails({ ...details, showonmap: ev.target.checked ? 1 : 0})}
            />
          </Form.Group>
          <Form.Group controlId="formDefault">
            <Form.Check
              type="checkbox"
              label="Set as Default"
              checked={details.default}
              onChange={(ev) => setDetails({ ...details, default: ev.target.checked ? 1 : 0 })}
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
