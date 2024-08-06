import React from 'react';
import { Card } from 'react-bootstrap';
import './newsitem.scss';

const NewsItem = ({ item, onClick }) => (
  <Card className="news-item" onClick={onClick}>
    <Card.Img variant="top" src={item.image} />
    <Card.Body>
      <Card.Title>{item.title}</Card.Title>
    </Card.Body>
    <Card.Footer>
      <small className="text-muted">{item.author} - {new Date(item.date).toLocaleDateString()}</small>
      <div className="news-item-menu">...</div>
    </Card.Footer>
  </Card>
);

export default NewsItem;
