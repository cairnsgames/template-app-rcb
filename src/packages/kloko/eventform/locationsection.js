import React from "react";
import { Form } from "react-bootstrap";
import LocationSelect from "../LocationSelect";

const LocationSection = ({ location, setLocation }) => {
  return (
    <div className="border p-2 my-3">
      <h3>Location</h3>
      <Form.Group controlId="location">
        <LocationSelect value={location} onChange={setLocation} />
        <Form.Text className="text-muted">
          If the location is not listed, please add it to the locations
        </Form.Text>
      </Form.Group>
    </div>
  );
};

export default LocationSection;
