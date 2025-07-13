import React from "react";
import HighlightText from "../../components/highlighttext";
import { Pencil, Trash } from "react-bootstrap-icons"; // Importing Trash icon
import "./newsthumb.scss";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { Button, ButtonGroup } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const NewsThumb = ({ item, onClick, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const onDeleteItem = (ev) => {
    ev.stopPropagation();
    onDelete(item.id);
  };

  const clickOnCard = () => {
    if (onClick) {
      onClick(item.id);
    }
  };

  return (
    <div className="news-thumb" onClick={clickOnCard}>
      {item.image_url && (
        <img
          className="news-thumb-image"
          data-original={item.image}
          alt={item.title}
          src={combineUrlAndPath(process.env.REACT_APP_FILES, `${item.image_url}`)}
        />
      )}
      <div
        className="news-thumb-content"
        style={{ width: item.image ? "75%" : "100%" }}
      >
        <div className="news-thumb-header">
          <strong className="news-thumb-title">
            <HighlightText text={item.title} />
          </strong>
          <ButtonGroup>
            {onEdit && <Button size="sm" variant="light" onClick={onEdit}><Pencil className="edit-icon" /></Button>}
            {onDelete && <Button size="sm" variant="light" onClick={onDeleteItem}><Trash className="delete-icon" /></Button>}
          </ButtonGroup>
        </div>
        <div className="news-thumb-meta">
          <small className="news-thumb-author">{item.author}</small>
          <small className="news-thumb-date">
            {t('news.date', { date: new Date(item.date).toLocaleDateString() })}
          </small>
        </div>
        <em className="news-thumb-body">
          <HighlightText text={item.body} />
        </em>
      </div>
    </div>
  );
};

export default NewsThumb;
