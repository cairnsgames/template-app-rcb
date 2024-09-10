import React from 'react';
import { useNews } from './newscontext';
import NewsItem from './newsitem';
import NewsThumb from './newsthumb';
import './news.scss';

const News = ({ layout = 'default' }) => {
  const { newsItems } = useNews();

  const handleItemClick = (id) => {
    window.location.hash = `#news/${id}`;
  };

  return (
    <div className="news">
      {newsItems.map(item => (
        layout === 'custom' 
          ? <NewsThumb key={item.id} item={item} onClick={() => handleItemClick(item.id)} />
          : <NewsItem key={item.id} item={item} onClick={() => handleItemClick(item.id)} />
      ))}
    </div>
  );
};

export default News;
