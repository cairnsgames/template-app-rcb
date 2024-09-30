import React, { createContext, useState, useEffect, useCallback } from "react";

// Create the Assistant Context
export const AssistantContext = createContext();

// Assistant Provider Component
export const AssistantProvider = ({ children, user, token, tenant }) => {
  const [venue, setVenue] = useState(null); // Venue ID
  const [roles, setRoles] = useState([]); // Roles of the user
  const [permissions, setPermissions] = useState([]); // Permissions for the user/venue combination
  const [venues, setVenues] = useState([]);

  const headers = {
    "Content-Type": "application/json",
    APP_ID: tenant,
    token: token,
  };

  const fetchAssistantVenues = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ASSISTANT_API}/api.php/user/${user.id}/venues`,
        { headers }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch venues");
      }
      const data = await response.json();
      setVenues(data || []);
    } catch (error) {
      console.error("Error fetching venues:", error);
      return [];
    }
  };

  // Fetch User Roles Function
  const fetchUserRoles = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ASSISTANT_API}/api.php/user/${user.id}/roles`,
        { headers }
      );
      const data = await response.json();
      if (data.success) {
        setRoles(data.roles || []);
      } else {
        console.error("Failed to fetch user roles:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user roles:", error);
    }
  }, []);

  // Fetch User Permissions for Venue
  const fetchUserPermissions = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ASSISTANT_API}/permissions.php?user=${user.id}&venue=${venue}`,
        { headers }
      );
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

  // Effect to fetch user roles whenever user is set
  useEffect(() => {
    if (user && user.id) {
        console.log("*** Found user ID", user.id);
      fetchAssistantVenues();
    }
  }, [user, fetchUserRoles]);

  // Effect to fetch user permissions whenever user or venue is set
  useEffect(() => {
    if (user && user.id && venue) {
      fetchUserPermissions();
    }
  }, [user, venue, fetchUserPermissions]);

  return (
    <AssistantContext.Provider
      value={{
        venue,
        setVenue,
        roles,
        permissions,
        venues,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};
