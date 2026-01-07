import React, { useState, useEffect } from 'react';
import { useLocations } from './context/uselocations';
import { Button, InputGroup, Form } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import LocationSelectModal from './LocationSelectModal';

const LocationSelect = ({ onChange, ...props }) => {
  console.log("LocationSelect props", props);
  const { userLocations, createUserLocation } = useLocations();
  console.log('LocationSelect - userLocations (from useLocations)', userLocations);
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

  // Derive the incoming location object from multiple possible prop shapes
  // (some parents pass `location.value`, others pass `value` directly).
  // Try a case-insensitive name match first, then fall back to lat/lng matching.
  useEffect(() => {
    const incoming = props.location?.value ?? props.value ?? props.value?.value;
    const targetNameRaw = incoming?.name;
    const targetLat = incoming?.lat;
    const targetLng = incoming?.lng;

    console.log('default-selection useEffect - incoming prop object', incoming);

    if (!targetNameRaw && (targetLat == null || targetLng == null)) {
      console.log('default-selection - no usable incoming location info');
      return;
    }

    const targetName = targetNameRaw ? String(targetNameRaw).trim().toLowerCase() : null;

    // If already selected and names match (case-insensitive), do nothing
    if (
      selectedLocation &&
      selectedLocation.name &&
      targetName &&
      String(selectedLocation.name).trim().toLowerCase() === targetName
    ) {
      console.log('default-selection - already selected and matches, skipping');
      return;
    }

    if (!Array.isArray(userLocations) || userLocations.length === 0) {
      console.log('default-selection - userLocations empty or not array yet');
      return;
    }

    console.log('default-selection - searching userLocations', userLocations);

    let match = null;
    if (targetName) {
      match = userLocations.find((loc) =>
        loc.name && String(loc.name).trim().toLowerCase() === targetName
      );
      console.log('default-selection - name match result', match);
    }

    // Fallback: try matching by lat/lng if no name match
    if (!match && targetLat != null && targetLng != null) {
      const eps = 0.00001;
      match = userLocations.find((loc) => {
        const lat = parseFloat(loc.lat ?? loc.latitude ?? NaN);
        const lng = parseFloat(loc.lng ?? loc.longitude ?? NaN);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
        return Math.abs(lat - Number(targetLat)) < eps && Math.abs(lng - Number(targetLng)) < eps;
      });
      console.log('default-selection - lat/lng match result', match);
    }

    if (match) {
      setSelectedLocation(match);
      if (typeof onChange === 'function') onChange(match);
    }
  }, [props.location, props.value, userLocations]);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    console.log('handleSelectChange - raw value', value);
    const loc = userLocations.find((location) => location.id === Number(value));
    console.log('handleSelectChange - resolved loc', loc);
    setSelectedLocation(loc);
    if (typeof onChange === 'function') onChange(loc); // Call the onChange prop with the new value
  };

  useEffect(() => {
    console.log('userLocations updated', userLocations);
  }, [userLocations]);

  useEffect(() => {
    console.log('selectedLocation updated', selectedLocation);
  }, [selectedLocation]);

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
