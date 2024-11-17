import { useContext } from "react";
import { KlokoLocationContext } from "./klokolocationprovider";

export const useLocations = () => {
  // Get the context
  const context = useContext(KlokoLocationContext);

  // If `undefined`, throw an error
  if (!context) {
    throw new Error("useLocations must be used within a KlokoLocationProvider");
  }

  const { userLocations, locations, getLocationById, createUserLocation, updateUserLocation } = context;

  return { userLocations, locations, getLocationById, createUserLocation, updateUserLocation };
};

export default useLocations;
