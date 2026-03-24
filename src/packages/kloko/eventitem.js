import React from "react";
import { Card } from "react-bootstrap";
import "./eventitem.scss";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { useTranslation } from "react-i18next";
import FavoriteIcon from "./FavoriteIcon";

const EventItem = ({ item, onClick }) => {
  const { t } = useTranslation();

  const hasImage = item?.image && item.image.length > 0;
  const keywordsStr = Array.isArray(item?.keywords) ? item.keywords.join(', ') : item?.keywords;

  // Normalize description: convert literal "\\n" sequences to real newlines
  // and provide emoji-friendly font fallbacks.
  const rawDescription = item?.description ?? "";
  const description = typeof rawDescription === "string" ? rawDescription.replace(/\\\\n/g, "\n") : rawDescription;
  const descriptionTextStyle = {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontFamily: 'inherit, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Symbol"',
  };

  // Safely convert newlines to <br/> for reliable rendering across components.
  const escapeHtml = (str) =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const htmlDescription = typeof description === "string"
    ? escapeHtml(description).replace(/\n/g, "<br/>")
    : "";

  const clickOnCard = () => {
    console.log("Clicked on EventItem:", item.id);
    if (onClick) {
      onClick(item.id);
    }
  };

  return (
    <Card className="news-item" onClick={clickOnCard}>
      <div style={{ position: "relative" }}>
        {item.image && item.image.length > 0 && (
          <>
            <Card.Img
              variant="top"
              src={combineUrlAndPath(process.env.REACT_APP_FILES, item.image)}
              style={{ height: "100%", width: "100%" }}
            />
            <div
              style={{ position: "absolute", top: 8, right: 8 }}
              className="favorite-icon-overlay"
            >
              <FavoriteIcon event_id={item.id} favorite={item.favorite} />
            </div>
          </>
        )}
      </div>
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
        {!hasImage && (
          <>
            {description ? (
              <Card.Text
                style={descriptionTextStyle}
                dangerouslySetInnerHTML={{ __html: htmlDescription }}
              />
            ) : null}
            {keywordsStr ? (
              <Card.Text className="text-muted small">Keywords: {keywordsStr}</Card.Text>
            ) : null}
          </>
        )}
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">
          {t("events.date", {
            date: new Date(item.start_time).toLocaleDateString(),
          })}
        </small>
        <div className="event-item-menu">...</div>
      </Card.Footer>
    </Card>
  );
};

export default EventItem;
