import React, { useState, useEffect } from "react";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";

export const KlokoEventsContext = React.createContext();

export const KlokoEventsProvider = ({ children, user, tenant, token }) => {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [activeEvent, setActiveEvent] = useState();
  const [eventId, setEventId] = useState();

  if (!process.env.REACT_APP_KLOKO_API) {
    throw new Error(
      "KlokoEventsProvider: REACT_APP_KLOKO_API environment variable is required"
    );
  }

  const headers = { APP_ID: tenant, token: token };

  useEffect(() => {
    if (eventId) {
      const ev = events.find((event) => event.id === Number(eventId));
      if (ev) {
        setActiveEvent(ev);
      }
    }
  }, [eventId, events]);

  React.useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/events`
        ),
        {
          method: "POST",
          headers: headers,
        }
      );
      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user events:", error);
      setLoading(false);
    }
  };

  return (
    <KlokoEventsContext.Provider value={{ events, loading, activeEvent, eventId, setEventId }}>
      {children}
    </KlokoEventsContext.Provider>
  );
}