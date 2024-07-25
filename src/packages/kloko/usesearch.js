
import { useContext } from "react";
import { KlokoContext } from "./klokoprovider";

export const useSearch = () => {
  // get the context 
  const context = useContext(KlokoContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useSearch was used outside of its Provider");
  }

  const { searchResults, searchEventListing } = context;

  return { searchResults, searchEventListing };
};

export default useSearch;
