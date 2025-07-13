import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useUser from "../auth/context/useuser";
import { Save } from "react-bootstrap-icons";

const UserPropertyForm = ({ onSave, width = 6, optionalLabel = true }) => {
  const { t } = useTranslation();
  const { properties, saveProperties } = useUser();
  const [mergedProperties, setMergedProperties] = useState([]);

  useEffect(() => {
    const defaultProperties = [
      { name: "address", value: "", type: "text" },
      { name: "city", value: "", type: "text" },
      { name: "phone", value: "", type: "text" },
      {
        name: "language",
        value: "",
        type: "select",
        options: ["English", "Portuguese"],
      },
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

  const handleSave = () => {
    onSave();
    saveProperties(mergedProperties);
  };

  return (
    <div className="mt-4">
      <h5>{t("userPropertyForm.title", "User Properties")}</h5>
      {mergedProperties?.map((property, index) => (
        <Row key={property.name}>
          <Col md={width}>
            <Form.Group controlId={`property-${property.name}`}>
              <Form.Label>
                {t(`userPropertyForm.${property.name}Label`, property.name)}{" "}
                {optionalLabel && t("userPropertyForm.optional", "(Optional)")}
              </Form.Label>
              {property.type === "select" ? (
                <Form.Control
                  as="select"
                  value={property.value}
                  onChange={(e) => handlePropertyChange(index, e.target.value)}
                >
                  {property.options.map((option) => (
                    <option key={option} value={option}>
                      {t(
                        `userPropertyForm.languageOptions.${option.toLowerCase()}`,
                        option
                      )}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                <Form.Control
                  type="text"
                  value={property.value}
                  onChange={(e) => handlePropertyChange(index, e.target.value)}
                />
              )}
              {t(`userPropertyForm.${property.name}Description`) && (
                <Form.Text className="text-muted">
                  {t(`userPropertyForm.${property.name}Description`)}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>
      ))}

      <Button variant="primary mt-3" onClick={handleSave}>
        <Save className="me-2" />
        {t("userPropertyForm.saveButton", "Save")}
      </Button>
    </div>
  );
};

export default UserPropertyForm;
