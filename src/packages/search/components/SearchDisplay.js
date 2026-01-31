import React from "react";
import Tracker from "../../tracker/tracker";
import NewsCard from "../../news/newscard";
import NewsThumb from "../../news/newsthumb";
import NewsItem from "../../news/newsitem";

const SearchDisplay = ({ item, onClick, layout }) => {
  if (layout === "card") {
    return <NewsCard item={item} onClick={onClick} />;
  }
  if (layout === "thumb") {
    return <NewsThumb item={item} onClick={onClick} />;
  }
  return (
    <Tracker itemtype="news.card" id={item.id}>
      <NewsItem key={item.id} item={item} onClick={onClick} />
    </Tracker>
  );
};

export default SearchDisplay;
