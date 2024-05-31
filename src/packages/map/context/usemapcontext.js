import { useContext } from "react";
import { MapContext } from "./mapprovider";

export const useMapContext = () => {
  // get the context
  const context = useContext(MapContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useMapContext was used outside of its Provider");
  }
  // const { center } = context;

  return context;
};

export default useMapContext;