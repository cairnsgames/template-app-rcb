import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useUser from "../auth/context/useuser";
import { Save } from "react-bootstrap-icons";
import LocationSearch from "../../external/LocationSearch";

const UserPropertyForm = ({ onSave, optionalLabel = true }) => {
  const { t } = useTranslation();
  const { properties, saveProperties } = useUser();
  const [mergedProperties, setMergedProperties] = useState([]);

  console.log("Properties", properties);

  useEffect(() => {
    const defaultProperties = [
      // { name: "address", value: "", type: "text" },
      { name: "city", value: "", type: "city_lookup" },
      { name: "phone", value: "", type: "text" },
      {
        name: "language",
        value: "",
        type: "select",
        options: ["English", "Portuguese", "French", "Spanish"],
      },
    ];

    const updatedProperties = defaultProperties.map((defaultProp) => {
      const existingProp = properties.find(
        (prop) => prop.name === defaultProp.name
      );
      if (existingProp) {
        return {
          ...defaultProp,
          ...existingProp,
          options:
            defaultProp.type === "select" ? defaultProp.options : undefined,
        };
      }
      return defaultProp;
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
      <Row>
        {mergedProperties?.map((property, index) => (
          <Col key={property.name} zs={12} md={6}>
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
              ) : property.type === "city_lookup" ? (
                <LocationSearch
                  value={property.value}
                  onSelected={(nominatimResult) =>
                    handlePropertyChange(index, nominatimResult)
                  }
                />
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
        ))}
      </Row>

      <Button variant="primary mt-3" onClick={handleSave}>
        <Save className="me-2" />
        {t("userPropertyForm.saveButton", "Save")}
      </Button>
    </div>
  );
};

export default UserPropertyForm;
