import React, { createContext, useState, useEffect, useCallback } from 'react';

// Create the VenueAssistant Context
export const VenueAssistantContext = createContext();

// VenueAssistant Provider Component
export const VenueAssistantProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User object with ID, etc.
  const [venue, setVenue] = useState(null); // Venue ID
  const [roles, setRoles] = useState([]); // Roles for the venue
  const [permissions, setPermissions] = useState([]); // Permissions for the user/venue combination

  // Fetch Venue Roles Function
  const fetchVenueRoles = useCallback(async (venueId) => {
    if (!venueId) return; // Ensure venueId is provided
    try {
      const response = await fetch(`${process.env.REACT_APP_ASSISTANT_API}/permissions.php?venue=${venueId}`);
      const data = await response.json();
      if (data.success) {
        setRoles(data.roles || []);
      } else {
        console.error("Failed to fetch venue roles:", data.message);
      }
    } catch (error) {
      console.error("Error fetching venue roles:", error);
    }
  }, []);

  // Fetch User Permissions for Venue
  const fetchUserPermissions = useCallback(async (userId, venueId) => {
    if (!userId || !venueId) return; // Ensure both userId and venueId are provided
    try {
      const response = await fetch(`${process.env.REACT_APP_ASSISTANT_API}/permissions.php?user=${userId}&venue=${venueId}`);
      const data = await response.json();
      if (data.success) {
        setPermissions(data.permissions || []);
      } else {
        console.error("Failed to fetch user permissions:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user permissions:", error);
    }
  }, []);

  // Effect to fetch venue roles whenever venue is set
  useEffect(() => {
    if (venue) {
      fetchVenueRoles(venue);
    }
  }, [venue, fetchVenueRoles]);

  // Effect to fetch user permissions whenever user or venue is set
  useEffect(() => {
    if (user && user.id && venue) {
      fetchUserPermissions(user.id, venue);
    }
  }, [user, venue, fetchUserPermissions]);

  return (
    <VenueAssistantContext.Provider
      value={{
        user,
        setUser,
        venue,
        setVenue,
        roles,
        permissions,
      }}
    >
      {children}
    </VenueAssistantContext.Provider>
  );
};
