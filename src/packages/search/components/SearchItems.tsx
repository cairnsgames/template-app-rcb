import React from "react";
import { useNews } from "../../news/context/newscontext";
import SearchDisplay from "./SearchDisplay";
import type { NewsProviderValue, SearchItemsProps } from "../search.types";

export const SearchItems: React.FC<SearchItemsProps> = ({ count, layout, onClick }) => {
  const { newsItems } = useNews() as NewsProviderValue;
  const items = newsItems.slice(0, count);

  return (
    <>
      {items.map((item) => (
        <SearchDisplay key={item.id} item={item} layout={layout} onClick={onClick} />
      ))}
    </>
  );
};

export default SearchItems;
