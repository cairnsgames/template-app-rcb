import React from "react";
import { Card } from "react-bootstrap";
import "./newsitem.scss";
import { combineUrlAndPath } from "../../functions/combineurlandpath";

const NewsItem = ({ item, onClick }) => {
  console.log("Item", item);
  console.log(
    "Image Path",
    combineUrlAndPath(process.env.REACT_APP_FILES, item.image_url)
  );
  return (
    <Card className="news-item" onClick={()=>onClick(item)}>
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
          {item.author} - {new Date(item.date).toLocaleDateString()}
        </small>
        <div className="news-item-menu">...</div>
      </Card.Footer>
    </Card>
  );
};

export default NewsItem;
