import React, { useState } from "react";
import FavoriteIcon from "./FavoriteIcon";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { formatEventDate } from "./eventfunctions";
import Tracker from "../tracker/tracker";
import { useTranslation } from 'react-i18next';
import "./eventthumb.scss";

const EventThumb = ({ event, onClick, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(true);

  const onDeleteItem = (ev) => {
    ev.stopPropagation();
    onDelete(event.id);
  };

  const clickOnCard = () => {
    if (onClick) {
      onClick(event.id);
    }
  };

  return (
    <Tracker itemtype="event.card" id={event.id}>
      <Card className="event-thumb" onClick={clickOnCard}>
        {imageLoaded && event.image && (
          <div className="event-thumb-image-container">
            <img
              className="event-thumb-image"
              src={combineUrlAndPath(process.env.REACT_APP_FILES, event.image)}
              alt={event.title}
              onError={() => setImageLoaded(false)}
            />
            <div className="favorite-icon-overlay">
              <FavoriteIcon event_id={event.id} favorite={event.favorite} />
            </div>
          </div>
        )}
        <div
          className="event-thumb-content"
          style={{ width: event.image ? "75%" : "100%" }}
        >
          <div className="event-thumb-header">
            <strong className="event-thumb-title">{event.title}</strong>
            <ButtonGroup>
              {onEdit && (
                <Button
                  size="sm"
                  variant="light"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pencil className="edit-icon" />
                </Button>
              )}
              {onDelete && (
                <Button size="sm" variant="light" onClick={onDeleteItem}>
                  <Trash className="delete-icon" />
                </Button>
              )}
            </ButtonGroup>
          </div>
          <div className="event-thumb-meta">
            <small>{formatEventDate(event.start_time, event.end_time)}</small>
          </div>
          <div className="event-thumb-details">
            {event.location && `${event.location}`}{event.location && event.max_participants && ' • '}{event.max_participants && `Max: ${event.max_participants}`}
          </div>
        </div>
      </Card>
    </Tracker>
  );
};

export default EventThumb;
