import { useContext } from "react";
import { GPSContext } from "./gpsprovider";

export const useGPS = () => {
  const context = useContext(GPSContext);
  if (!context) {
    throw new Error("useGPS was used outside of its Provider");
  }
  const { loading, getLocationDetails } = context;
  return { loading, getLocationDetails };
};

export default useGPS;
