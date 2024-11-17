import React, { createContext, useState, useEffect, useMemo } from "react";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";

// Create context for location management
export const KlokoLocationContext = createContext();

// Data provider component
export const KlokoLocationProvider = ({ children, user, tenant, token }) => {
  const [userLocations, setUserLocations] = useState([]);
  const [locations, setLocations] = useState({});

  if (!process.env.REACT_APP_KLOKO_API) {
    throw new Error(
      "KlokoLocationProvider: REACT_APP_KLOKO_API environment variable is required"
    );
  }

  const headers = { APP_ID: tenant, token: token };

  useEffect(() => {
    if (user) {
      fetchUserLocations();
    }
  }, [user]);

  const fetchUserLocations = async () => {
    try {
      console.log("Fetching user locations");
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/user/${user.id}/locations`
        ),
        {
          headers: headers,
        }
      );
      const data = await response.json();
      setUserLocations(data);
      // Populate locations cache
      const locationsCache = {};
      data.forEach((location) => {
        locationsCache[location.id] = location;
      });
      setLocations(locationsCache);
    } catch (error) {
      console.error("Error fetching user locations:", error);
    }
  };

  const getLocationById = async (id) => {
    if (locations[id]) {
      return locations[id]; // Return from cache if available
    }
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/location/${id}`
        )
      );
      const location = await response.json();
      setLocations((prev) => ({ ...prev, [id]: location })); // Add to cache
      return location;
    } catch (error) {
      console.error("Error fetching location by ID:", error);
    }
  };

  const createUserLocation = async (locationData) => {
    try {
      // First create the location
      const locationResponse = await fetch(
        combineUrlAndPath(process.env.REACT_APP_KLOKO_API, `api.php/location`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...headers,
          },
          body: JSON.stringify(locationData),
        }
      );
      let newLocation = await locationResponse.json();

      console.log("newLocation response", newLocation);
      if (Array.isArray(newLocation)) {
        newLocation = newLocation[0];
      }

      // Then create the user location
      const userLocationResponse = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/user_location`
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...headers,
          },
          body: JSON.stringify({
            user_id: user.id,
            location_id: newLocation.id,
          }),
        }
      );
      const createdUserLocation = await userLocationResponse.json();
      createdUserLocation.forEach((location) => {
        setUserLocations((prev) => [...prev, createdUserLocation]);
        setLocations((prev) => ({ ...prev, [newLocation.id]: newLocation }));
      });
    } catch (error) {
      console.error("Error creating user location:", error);
    }
  };

  const updateUserLocation = async (id, locationData) => {
    try {
      // Update the location only
      const locationResponse = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/locations/${id}`
        ),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...headers,
          },
          body: JSON.stringify(locationData),
        }
      );
      const updatedLocation = await locationResponse.json();
      setLocations((prev) => ({ ...prev, [id]: updatedLocation }));
    } catch (error) {
      console.error("Error updating user location:", error);
    }
  };

  const values = useMemo(
    () => ({
      userLocations,
      locations,
      getLocationById,
      createUserLocation,
      updateUserLocation,
    }),
    [userLocations, locations]
  );

  return (
    <KlokoLocationContext.Provider value={values}>
      {children}
    </KlokoLocationContext.Provider>
  );
};

// Custom hook for using the LocationContext
export default KlokoLocationProvider;
