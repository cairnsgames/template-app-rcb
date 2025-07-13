import React from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const DisplaySettings = ({
  enableBookings,
  setEnableBookings,
  showInNews,
  setShowInNews,
  overlayText,
  setOverlayText
}) => {
  const { t } = useTranslation();

  return (
    <div className="border p-2 my-3">
      <h3>{t('displaySettings.title')}</h3>
      <Form.Group controlId="enableBookings">
        <Form.Check
          type="checkbox"
          label={t('displaySettings.enableBookings')}
          checked={enableBookings}
          onChange={(e) => setEnableBookings(e.target.checked)}
        />
      </Form.Group>

      <Form.Group controlId="showInNews">
        <Form.Check
          type="checkbox"
          label={t('displaySettings.showInNews')}
          checked={showInNews}
          onChange={(e) => setShowInNews(e.target.checked)}
        />
      </Form.Group>

      <Form.Group controlId="overlayText">
        <Form.Check
          type="checkbox"
          label={t('displaySettings.overlayText')}
          checked={overlayText}
          onChange={(e) => setOverlayText(e.target.checked)}
        />
      </Form.Group>
    </div>
  );
};

export default DisplaySettings;
