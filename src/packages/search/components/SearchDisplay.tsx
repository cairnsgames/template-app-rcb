import React from "react";
import Tracker from "../../tracker/tracker";
import NewsCard from "../../news/newscard";
import NewsThumb from "../../news/newsthumb";
import NewsItem from "../../news/newsitem";
import type { SearchDisplayProps } from "../search.types";

type NewsComponentProps = {
  item: SearchDisplayProps["item"];
  onClick: SearchDisplayProps["onClick"];
  onEdit?: () => void;
  onDelete?: () => void;
};

const TypedNewsCard = NewsCard as React.ComponentType<NewsComponentProps>;
const TypedNewsThumb = NewsThumb as React.ComponentType<NewsComponentProps>;

const SearchDisplay: React.FC<SearchDisplayProps> = ({ item, onClick, layout }) => {
  if (layout === "card") {
    return <TypedNewsCard item={item} onClick={onClick} />;
  }

  if (layout === "thumb") {
    return <TypedNewsThumb item={item} onClick={onClick} />;
  }

  return (
    <Tracker itemtype="news.card" id={item.id} itemid={item.id}>
      <NewsItem key={String(item.id)} item={item} onClick={onClick} />
    </Tracker>
  );
};

export default SearchDisplay;
