
import { useContext } from "react";
import { KlokoMyEventContext } from "./klokomyeventprovider";

export const useSearch = () => {
  // get the context 
  const context = useContext(KlokoMyEventContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useSearch was used outside of its Provider");
  }

  const { searchResults, searchEventListing, refetchSearch } = context;

  return { searchResults, searchEventListing, refetchSearch };
};

export default useSearch;
