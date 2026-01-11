import React from "react";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import SelectLocationModal from "../../gps/selectlocationmodal";

const LocationEditModal = ({ show, handleClose, details, setDetails, handleSave }) => {
  console.log("AAAA LocationEditModal rendered with details:", details);
  const selectLocation = (pos) => {
    // Expect pos in { lat, lng, name } format
    console.log("AAAA Location selected:", pos);
    if (!pos) return;
    setDetails({ ...details, lat: pos.lat, lng: pos.lng });
  }

  const setAddress = (address) => {
    // Expect address in { lat, lng, name } format
    if (!address) return;
    const newDetails = {
      ...details,
      lat: address.lat,
      lng: address.lng,
      address_line1: address.name,
      town: details.town,
      country: details.country,
    };
    if (!newDetails.name || newDetails.name === "") {
      newDetails.name = address.name;
    }
    console.log("AAAA Address selected:", address, "-> updating details to:", newDetails);
    setDetails(newDetails);
  }

  const canSave = !!details &&
    details.lat !== undefined && details.lat !== null && details.lat !== "" &&
    details.lng !== undefined && details.lng !== null && details.lng !== "";

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
            <Form.Text className="text-muted">This is the name you will need to remember</Form.Text>
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
            <SelectLocationModal
              onSelectLocation={selectLocation}
              onSelectAddress={setAddress}
              defaultStart={{ lat: details.lat, lng: details.lng, name: details.name }}
            />
            
          </InputGroup>
          {!details.lat && (
            <Form.Text className="text-muted mb-3">Please select a location above before setting the address.</Form.Text>
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
          <Form.Group controlId="formShowOnMap">
            <Form.Check
              type="checkbox"
              label="Show on Map"
              checked={details.showonmap}
              onChange={(ev) => setDetails({ ...details, showonmap: ev.target.checked ? 1 : 0})}
            />
            <Form.Text className="text-muted">Check this if you want to be associated with this location on the map - users can find you easier</Form.Text>
          </Form.Group>
          <Form.Group controlId="formDefault">
            <Form.Check
              type="checkbox"
              label="Set as Default"
              checked={details.default}
              onChange={(ev) => setDetails({ ...details, default: ev.target.checked ? 1 : 0 })}
            />
            <Form.Text className="text-muted">Is this your <strong>main</strong> location</Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!canSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationEditModal;
