import React, { createContext, useState, useEffect, useMemo } from "react";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";

// Create context for location management
export const KlokoLocationContext = createContext();

// Data provider component
export const KlokoLocationProvider = ({ children, user, tenant, token }) => {
  const [userLocations, setUserLocations] = useState([]);
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user locations:", error);
      setLoading(false);
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
            default: locationData.default || false,
          }),
        }
      );
      const createdUserLocation = await userLocationResponse.json();
      createdUserLocation.forEach((location) => {
        setUserLocations((prev) => [...prev, createdUserLocation]);
        setLocations((prev) => ({ ...prev, [newLocation.id]: newLocation }));
      });
      
      fetchUserLocations();
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
          `api.php/location/${id}`
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
      fetchUserLocations();
    } catch (error) {
      console.error("Error updating user location:", error);
    }
      // Update the location default
      const locationDefaultBody = {
        id: id,
        default: locationData.default,
      }
      console.log("locationDefaultBody", locationDefaultBody);
      const locationDefaultResponse = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/setUserDefaultLocation`
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...headers,
          },
          body: JSON.stringify(locationDefaultBody),
        }
      );
  };

  const deleteUserLocation = async (id) => {
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/location/${id}`
        ),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            ...headers,
          },
        }
      );
      if (response.ok) {
        setUserLocations((prev) => prev.filter(location => location.id !== id));
        setLocations((prev) => {
          const newLocations = { ...prev };
          delete newLocations[id];
          return newLocations;
        });
      } else {
        console.error("Error deleting user location:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user location:", error);
    }
  };

  const values = useMemo(
    () => ({
      userLocations,
      loading,
      locations,
      getLocationById,
      createUserLocation,
      updateUserLocation,
      deleteUserLocation,
    }),
    [userLocations, loading, locations]
  );

  return (
    <KlokoLocationContext.Provider value={values}>
      {children}
    </KlokoLocationContext.Provider>
  );
};

// Custom hook for using the LocationContext
export default KlokoLocationProvider;
