import React, { useState } from 'react';
import NewsItem from './newsitem';
import FullNewsItem from './fullnewsitem';
import { Container, Row, Col } from 'react-bootstrap';
import './news.scss';

const News = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <Container className="news px-2 pt-2">
      {selectedItem ? (
        <div className="full-news-item">
          <button onClick={() => setSelectedItem(null)}>Back</button>
          <FullNewsItem item={selectedItem} />
        </div>
      ) : (
        <Row className="news-list">
          {items.map(item => (
            <Col key={item.id} xs={12} md={6} lg={4} className="news-col">
              <NewsItem item={item} onClick={() => setSelectedItem(item)} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default News;
