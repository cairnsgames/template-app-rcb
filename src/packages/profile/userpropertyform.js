import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import useUser from "../auth/context/useuser";
import { Save } from "react-bootstrap-icons";

const UserPropertyForm = ({onSave, width=6, optionalLabel=true}) => {
  const { properties, saveProperties } = useUser();
  const [mergedProperties, setMergedProperties] = useState([]);

  useEffect(() => {
    const defaultProperties = [
      { name: "address", value: "" },
      { name: "city", value: "" },
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
    city: "City",
    phone: "Phone"
  };
  const text = {
    city: "Used to find news and events near you."
  }

  const labelFor = (name) => labels[name] || name;

  const handleSave = () => {
    onSave();
    saveProperties(mergedProperties);
  };

  return (
    <div className="mt-4">
      <h5>User Properties</h5>
      {mergedProperties?.map((property, index) => (
        <Row key={property.name}>
          <Col md={width}>
            <Form.Group controlId={`property-${property.name}`}>
              <Form.Label>{labelFor(property.name)} {optionalLabel && "(Optional)"}</Form.Label>
              <Form.Control
                type="text"
                value={property.value}
                onChange={(e) => handlePropertyChange(index, e.target.value)}
              />
              {text[property.name] && (
                <Form.Text className="text-muted">
                  {text[property.name]}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>
      ))}

      <Button
        variant="primary mt-3"
        onClick={handleSave}
      >
        <Save className="me-2"/>
        Save
      </Button>
    </div>
  );
}

export default UserPropertyForm;
