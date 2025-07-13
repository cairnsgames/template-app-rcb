import React from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import LocationSelect from "../LocationSelect";

const LocationSection = ({ location, setLocation }) => {
  const { t } = useTranslation();

  return (
    <div className="border p-2 my-3">
      <h3>{t('locationSection.title')}</h3>
      <Form.Group controlId="location">
        <LocationSelect value={location} onChange={setLocation} />
        <Form.Text className="text-muted">
          {t('locationSection.locationHint')}
        </Form.Text>
      </Form.Group>
    </div>
  );
};

export default LocationSection;
