import React from 'react';
import './fullnewsitem.scss';

const FullNewsItem = ({ item }) => (
  <div className="full-news-item">
    <img src={item.image} alt={item.title} className="full-news-image" />
    <h2>{item.title}</h2>
    <p>{item.body}</p>
    <div className="news-footer">
      <span>{item.author}</span>
      <span>{new Date(item.date).toLocaleDateString()}</span>
    </div>
  </div>
);

export default FullNewsItem;
