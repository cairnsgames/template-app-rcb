import { useContext } from "react";
import { KlokoLocationContext } from "./klokolocationprovider";

export const useLocations = () => {
  // Get the context
  const context = useContext(KlokoLocationContext);

  // If `undefined`, throw an error
  if (!context) {
    throw new Error("useLocations must be used within a KlokoLocationProvider");
  }

  const { loading, userLocations, locations, getLocationById, createUserLocation, updateUserLocation, deleteUserLocation } = context;

  return { loading, userLocations, locations, getLocationById, createUserLocation, updateUserLocation, deleteUserLocation };
};

export default useLocations;
