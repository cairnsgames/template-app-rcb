import { useContext } from "react";
import { GPSContext } from "./gpsprovider";

export const useGPS = () => {
  // get the context
  const context = useContext(GPSContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useGPS was used outside of its Provider");
  }

  const { loading, getLocationDetails } = context;

  return { loading, getLocationDetails };
};

export default useGPS;
