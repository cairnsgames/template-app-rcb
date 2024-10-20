import React from 'react';
import { useNews } from './context/newscontext';
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
      
      <div className="text-center">
        <h3>Latest News</h3>
      </div>
      {newsItems.map(item => (
        layout === 'custom' 
          ? <NewsThumb key={item.id} item={item} onClick={() => handleItemClick(item.id)} />
          : <NewsItem key={item.id} item={item} onClick={() => handleItemClick(item.id)} />
      ))}
      {newsItems.length === 0 && <p>No news items</p>}
    </div>
  );
};

export default News;
