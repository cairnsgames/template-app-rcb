import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import useUser from "../auth/context/useuser";
import { Save } from "react-bootstrap-icons";

function UserPropertyForm() {
  const { properties, saveProperties } = useUser();
  const [mergedProperties, setMergedProperties] = useState([]);

  useEffect(() => {
    const defaultProperties = [
      { name: "address", value: "" },
      { name: "phone", value: "" },
    ];

    const updatedProperties = defaultProperties.map((defaultProp) => {
      const existingProp = properties.find(
        (prop) => prop.name === defaultProp.name
      );
      return existingProp || defaultProp;
    });

    setMergedProperties(updatedProperties);
  }, [properties]);

  const handlePropertyChange = (index, value) => {
    const newProperties = [...mergedProperties];
    newProperties[index].value = value;
    setMergedProperties(newProperties);
  };

  const labels = {
    address: "Address",
    phone: "Phone",
  };

  const labelFor = (name) => labels[name] || name;

  const handleSave = () => {
    saveProperties(mergedProperties);
  };

  return (
    <div>
      <h5>User Properties</h5>
      {mergedProperties?.map((property, index) => (
        <Row key={property.name}>
          <Col md={6}>
            <Form.Group controlId={`property-${property.name}`}>
              <Form.Label>{labelFor(property.name)}</Form.Label>
              <Form.Control
                type="text"
                value={property.value}
                onChange={(e) => handlePropertyChange(index, e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      ))}

      <Button
        variant="primary mt-3"
        onClick={handleSave}
      >
        <Save />
        Save
      </Button>
    </div>
  );
}

export default UserPropertyForm;
