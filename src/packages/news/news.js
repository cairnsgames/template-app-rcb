import React from "react";
import { useNews } from "./context/newscontext";
import NewsItem from "./newsitem";
import NewsThumb from "./newsthumb";
import "./news.scss";
import NewsCard from "./newscard";

const NewsDisplay = ({ item, onClick, layout }) => {
  if ((layout === "card")) {
    return <NewsCard item={item} onClick={onClick} />;
  }
  if ((layout === "thumb")) {
    return <NewsThumb item={item} onClick={onClick} />;
  }
  return (
    <NewsItem
      key={item.id}
      item={item}
      onClick={onClick}
    />
  );
};

export const NewsItems = ({ count, layout, onClick }) => {
  
  const { newsItems } = useNews();
  const items = newsItems.slice(0, count);
  return (
    <>
      {items.map((item) => {
        return <NewsDisplay key={item.id} item={item} layout={layout} onClick={onClick}/>;
      })}</>
  );
}

const News = ({ layout = "default", items = 99999 }) => {
  const { newsItems } = useNews();

  const handleItemClick = (id) => {
    window.location.hash = `#news/${id}`;
  };

  return (
    <div className="news">
      <div className="text-center">
        <h3>Latest News</h3>
      </div>
      <NewsItems items={items} layout={layout}  onClick={handleItemClick} />
    </div>
  );
};

export default News;
