import React from "react";
import HighlightText from "./highlighttext";
import { Pencil } from "react-bootstrap-icons";
import "./newsthumb.scss";
import { combineUrlAndPath } from "../../functions/combineurlandpath";

const NewsThumb = ({ item, onClick, onEdit }) => {
  if (item.id === 10) {
    console.log("NewsThumb", item);
  }
  return (
    <div className="news-thumb" onClick={onClick}>
      {item.image_url && (
        <img
          className="news-thumb-image"
          data-original={item.image}
          alt={item.title}
          src={combineUrlAndPath(process.env.REACT_APP_FILES,`${item.image_url}`)}
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
          {onEdit && <Pencil className="edit-icon" onClick={onEdit} />}
        </div>
        <div className="news-thumb-meta">
          <small className="news-thumb-author">{item.author}</small>
          <small className="news-thumb-date">
            {new Date(item.date).toLocaleDateString()}
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
