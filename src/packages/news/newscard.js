import React from "react";
import HighlightText from "../../components/highlighttext";
import { Pencil, Trash } from "react-bootstrap-icons"; // Importing Trash icon
import "./newsthumb.scss";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { Button, Col } from "react-bootstrap";
import FloatingCard from "../../components/react-bootstrap-mobile/floatingcard";
import { useTranslation } from 'react-i18next';

const NewsCard = ({ item, onClick, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const clickOnCard = () => {
    if (onClick) {
      onClick(item.id);
    }
  };

  const overlayText = item?.overlay_text === "Y" ?? true;

  return (
    <Col xs={12} md={6} lg={4}>
      <FloatingCard
        className="m-3 m-3"
        image={combineUrlAndPath(
          process.env.REACT_APP_FILES,
          `${item.image_url}`
        )}
        onClick={clickOnCard}
      >
        {overlayText && (
          <>
            <FloatingCard.Header>
              {item?.overlay_text && (<h1>{item.overlay_text}</h1>)}
              <p className="text-center">{item.title}</p>
              <div className="news-thumb-meta">
                <small className="news-thumb-author">{item.author}</small>
                <small className="news-thumb-date">
                  {t('news.date', { date: new Date(item.date).toLocaleDateString() })}
                </small>
              </div>
            </FloatingCard.Header>
            <FloatingCard.Body>
              <HighlightText text={item.body} />
            </FloatingCard.Body>
            <FloatingCard.Footer>
              <Button variant="primary">{t('news.bookNow')}</Button>
            </FloatingCard.Footer>
          </>
        )}
      </FloatingCard>
    </Col>
  );
};

export default NewsCard;
