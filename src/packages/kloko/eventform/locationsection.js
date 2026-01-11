import React from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import LocationSelect from "../LocationSelect";
import useUser from "../../auth/context/useuser";
import { useLocations } from "../context/uselocations";

const LocationSection = ({ location, setLocation }) => {
  const { t } = useTranslation();
  const { defaultLocation} = useUser();
    const { userLocations } = useLocations();

  console.log("AAAA LocationSection defaultLocation:", defaultLocation);
  console.log("AAAA LocationSection location prop:", location);
  console.log("AAAA LocationSection userLocations from useLocations():", userLocations);

  return (
    <div className="border p-2 my-3">
      <h3>{t('locationSection.title')}</h3>
      <Form.Group controlId="location">
        <LocationSelect value={location ?? defaultLocation} onChange={setLocation} />
        <Form.Text className="text-muted">
          {t('locationSection.locationHint')}
        </Form.Text>
      </Form.Group>
    </div>
  );
};

export default LocationSection;
