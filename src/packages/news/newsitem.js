import React from "react";
import { Card } from "react-bootstrap";
import "./newsitem.scss";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { useTranslation } from 'react-i18next';

const NewsItem = ({ item, onClick }) => {
  const { t } = useTranslation();

  const clickOnCard = () => {
    if (onClick) {
      onClick(item.id);
    }
  }

  return (
    <Card className="news-item" onClick={clickOnCard}>
      <Card.Img
        variant="top"
        src={combineUrlAndPath(process.env.REACT_APP_FILES, item.image_url)}
        style={{ height: "100%", width: "100%" }}
      />
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">
          {t('news.date', { date: new Date(item.date).toLocaleDateString() })}
        </small>
        <div className="news-item-menu">...</div>
      </Card.Footer>
    </Card>
  );
};

export default NewsItem;
