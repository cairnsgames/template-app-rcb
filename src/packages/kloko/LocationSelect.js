import React, { useState } from 'react';
import { useLocations } from './context/uselocations';
import { Button, InputGroup, Form } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import LocationSelectModal from './LocationSelectModal';

const LocationSelect = ({ onChange, ...props }) => {
  const { userLocations, createUserLocation } = useLocations();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState({
    name: '',
    address_line1: '',
    address_line2: '',
    town: '',
    lat: '',
    lng: '',
  });

  console.log("selectedLocation", selectedLocation);

  const handleAddLocation = async () => {
    await createUserLocation(details);
    setShowModal(false);
    setDetails({
      name: '',
      address_line1: '',
      address_line2: '',
      town: '',
      lat: '',
      lng: '',
    });
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    const loc = userLocations.find((location) => location.id === Number(value));
    console.log("FINDING LOCATION", value, loc, userLocations)
    setSelectedLocation(loc);
    onChange(loc); // Call the onChange prop with the new value
  };

  return (
    <div>
      <InputGroup className="mb-3">
        <Form.Select
          {...props}
          value={selectedLocation?.id ?? 0}
          onChange={handleSelectChange} // Use the new handler
        >
          <option value="0">Select a location</option>
          {Array.isArray(userLocations) && userLocations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </Form.Select>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus /> Add
        </Button>
      </InputGroup>
      <LocationSelectModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleAddLocation}
        details={details}
        setDetails={setDetails}
      />
    </div>
  );
};

export default LocationSelect;
