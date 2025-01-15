import React from "react";
import HighlightText from "../../components/highlighttext";
import { Pencil, Trash } from "react-bootstrap-icons"; // Importing Trash icon
import "./newsthumb.scss";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { Button, Col } from "react-bootstrap";
import FloatingCard from "../../components/react-bootstrap-mobile/floatingcard";

const NewsCard = ({ item, onClick, onEdit, onDelete }) => {
  console.log("NewsCard", item);
  if (item.id === 10) {
    console.log("NewsThumb", item);
  }

  const overlayText = item?.overlay_text === "Y" ?? true;

  return (
    <Col xs={12} md={6} lg={4}>
      <FloatingCard
        className="m-3 m-3"
        image={combineUrlAndPath(
          process.env.REACT_APP_FILES,
          `${item.image_url}`
        )}
        onClick={()=>onClick(item)}
      >
        {overlayText && (
          <>
            <FloatingCard.Header>
              {item?.overlay_text && (<h1>{item.overlay_text}</h1>)}
              <p className="text-center">{item.title}</p>
              <div className="news-thumb-meta">
                <small className="news-thumb-author">{item.author}</small>
                <small className="news-thumb-date">
                  {new Date(item.date).toLocaleDateString()}
                </small>
              </div>
            </FloatingCard.Header>
            <FloatingCard.Body>
              <HighlightText text={item.body} />
            </FloatingCard.Body>
            <FloatingCard.Footer>
              <Button variant="primary">Book Now</Button>
            </FloatingCard.Footer>
          </>
        )}
      </FloatingCard>
    </Col>
  );
};

export default NewsCard;
