import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const EventDetails = ({
  title,
  setTitle,
  description,
  setDescription,
  keywords,
  setKeywords,
  maxParticipants,
  setMaxParticipants,
}) => {
  const { t } = useTranslation();

  const handleHomeRedirect = () => {
    window.location.hash = "#home";
  };

  return (
    <div className="border p-2 my-3 position-relative">
      <button
        className="btn position-absolute"
        style={{ top: "10px", right: "10px" }}
        onClick={handleHomeRedirect}
      >
        {t('eventDetails.closeButton')}
      </button>
      <h3>{t('eventDetails.eventDetailsTitle')}</h3>
      <Form.Group controlId="title">
        <Form.Label>{t('eventDetails.title')}</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label>{t('eventDetails.description')}</Form.Label>
        <InputGroup>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="eventType">
        <Form.Label>
          {t('eventDetails.danceStyles')}
          <br />
          <Form.Text className="text-muted">
            <small>{t('eventDetails.danceStylesHint')}</small>
          </Form.Text>
        </Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Salsa, Bachata, Kizomba"
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="maxParticipants">
        <Form.Label>
          {t('eventDetails.maxParticipants')}
          <br />
          <Form.Text className="text-muted">
            <small>{t('eventDetails.maxParticipantsHint')}</small>
          </Form.Text>
        </Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
          />
        </InputGroup>
      </Form.Group>
    </div>
  );
};

export default EventDetails;
