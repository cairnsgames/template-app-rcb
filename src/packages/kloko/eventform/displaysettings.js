import React from "react";
import { Form } from "react-bootstrap";

const DisplaySettings = ({
  enableBookings,
  setEnableBookings,
  showInNews,
  setShowInNews,
  overlayText,
  setOverlayText
}) => {
  return (
    <div className="border p-2 my-3">
      <h3>Display Settings</h3>
      <Form.Group controlId="enableBookings">
        <Form.Check
          type="checkbox"
          label="Enable Bookings - Juzt.Dance will accept payments for you"
          checked={enableBookings}
          onChange={(e) => setEnableBookings(e.target.checked)}
        />
      </Form.Group>

      <Form.Group controlId="showInNews">
        <Form.Check
          type="checkbox"
          label="Show in News - Adds a card on the news page"
          checked={showInNews}
          onChange={(e) => setShowInNews(e.target.checked)}
        />
      </Form.Group>

      <Form.Group controlId="overlayText">
        <Form.Check
          type="checkbox"
          label="Overlay Text - Uncheck this if your image has text in it"
          checked={overlayText}
          onChange={(e) => setOverlayText(e.target.checked)}
        />
      </Form.Group>
    </div>
  );
};

export default DisplaySettings;
