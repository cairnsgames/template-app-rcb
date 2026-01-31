import React from "react";
import { useNews } from "../../news/context/newscontext";
import SearchDisplay from "./SearchDisplay";

export const SearchItems = ({ count, layout, onClick }) => {
  const { newsItems } = useNews();
  const items = newsItems.slice(0, count);

  return (
    <>
      {items.map((item) => {
        return (
          <SearchDisplay
            key={item.id}
            item={item}
            layout={layout}
            onClick={onClick}
          />
        );
      })}
    </>
  );
};

export default SearchItems;
