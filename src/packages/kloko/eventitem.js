import React from "react";
import { Card } from "react-bootstrap";
import "./eventitem.scss";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { useTranslation } from 'react-i18next';

const EventItem = ({ item, onClick }) => {
  const { t } = useTranslation();

  const clickOnCard = () => {
    if (onClick) {
      onClick(item.id);
    }
  }

  console.log("Rendering EventItem for item:", item);

  return (
    <Card className="news-item" onClick={clickOnCard}>
      <Card.Img
        variant="top"
        src={combineUrlAndPath(process.env.REACT_APP_FILES, item.image)}
        style={{ height: "100%", width: "100%" }}
      />
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">
          {t('events.date', { date: new Date(item.start_time).toLocaleDateString() })}
        </small>
        <div className="event-item-menu">...</div>
      </Card.Footer>
    </Card>
  );
};

export default EventItem;
