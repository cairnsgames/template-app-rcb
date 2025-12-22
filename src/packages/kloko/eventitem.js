import React from "react";
import { Card } from "react-bootstrap";
import "./eventitem.scss";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { useTranslation } from 'react-i18next';
import FavoriteIcon from "./FavoriteIcon";

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
      <div style={{ position: 'relative' }}>
        <Card.Img
          variant="top"
          src={combineUrlAndPath(process.env.REACT_APP_FILES, item.image)}
          style={{ height: "100%", width: "100%" }}
        />
        {item.image && (
          <div style={{ position: 'absolute', top: 8, right: 8 }} className="favorite-icon-overlay">
            <FavoriteIcon event_id={item.id} favorite={item.favorite} />
          </div>
        )}
      </div>
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
