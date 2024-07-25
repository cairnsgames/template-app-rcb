import React, { createContext, useState, useEffect, useMemo } from "react";

// Create context for Calendar, Event, Booking, and Template management
export const KlokoContext = createContext();

// Data provider component
export const KlokoProvider = ({ children, user, tenant, token }) => {
  const [calendars, setCalendars] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [activeCalendar, setActiveCalendar] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [headers, setHeaders] = useState({});

  if (!process.env.REACT_APP_KLOKO_API) {
    throw new Error(
      "KlokoProvider: REACT_APP_KLOKO_API environment variable is required"
    );
  }

  useEffect(() => {
    console.log("KlokoProvider: Search", user, tenant, token);
    setHeaders({ APP_ID: tenant, token: token });
  }, [user, tenant, token]);

  useEffect(() => {
    if (user) {
      fetchCalendars();
      fetchTemplates();
    }
  }, [user]);

  useEffect(() => {
    if (activeCalendar) {
      fetchEvents(activeCalendar);
    }
  }, [activeCalendar]);

  useEffect(() => {
    if (activeEvent) {
      fetchBookings(activeEvent);
    }
  }, [activeEvent]);

  useEffect(() => {
    console.log("Event data changed", events);
  }, [events]);

  // Fetch calendars
  const fetchCalendars = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/user/${user.id}/calendars`,
        { headers }
      );
      const data = await response.json();
      setCalendars(data);
      if (!activeCalendar && data.length > 0) setActiveCalendar(data[0].id);
    } catch (error) {
      console.error("Error fetching calendars:", error);
    }
    setLoading(false);
  };

  // Fetch events
  const fetchEvents = async (calendarId) => {
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_KLOKO_API}/api.php/calendar/${calendarId}/events`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch bookings
  const fetchBookings = async (eventId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/event/${eventId}/bookings`,
        { headers }
      );
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setLoading(false);
  };

  // Fetch templates
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/user/${user.id}/templates`,
        { headers }
      );
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
    setLoading(false);
  };

  // Create, Update, Delete functions
  const createCalendar = async (calendar) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/calendar`,
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(calendar),
        }
      );
      const newCalendar = await response.json();
      setCalendars((prev) => [...prev, newCalendar]);
      setLoading(false);
      return [newCalendar];
    } catch (error) {
      console.error("Error creating calendar:", error);
      setLoading(false);
      return [];
    }
  };

  const updateCalendar = async (calendar) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/calendar/${calendar.id}`,
        {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(calendar),
        }
      );
      const updatedCalendar = await response.json();
      setCalendars((prev) =>
        prev.map((c) => (c.id === updatedCalendar.id ? updatedCalendar : c))
      );
      setLoading(false);
      return [updatedCalendar];
    } catch (error) {
      console.error("Error updating calendar:", error);
      setLoading(false);
      return [];
    }
  };

  const deleteCalendar = async (calendarId) => {
    setLoading(true);
    try {
      await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/calendar/${calendarId}`,
        { method: "DELETE", headers }
      );
      setCalendars((prev) => prev.filter((c) => c.id !== calendarId));
      setLoading(false);
    } catch (error) {
      console.error("Error deleting calendar:", error);
      setLoading(false);
    }
  };

  const createEvent = async (event) => {
    setLoading(true);
    try {
      event.calendar_id = activeCalendar;
      const response = await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/event`,
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(event),
        }
      );
      let newEvent = await response.json();
      newEvent = newEvent.map(event => {
        event.start = event.start_time;
        event.end = event.end_time;
        return event;
      });
      console.log("New event created", newEvent);
      setEvents(prev => [...prev, ...newEvent]);
      setLoading(false);
      return [newEvent];
    } catch (error) {
      console.error("Error creating event:", error);
      setLoading(false);
      return [];
    }
  };

  const updateEvent = async (event) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/events/${event.id}`,
        {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(event),
        }
      );
      const updatedEvent = await response.json();
      setEvents((prev) =>
        prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
      );
      setLoading(false);
      return [updatedEvent];
    } catch (error) {
      console.error("Error updating event:", error);
      setLoading(false);
      return [];
    }
  };

  const deleteEvent = async (eventId) => {
    setLoading(true);
    try {
      await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/event/${eventId}`,
        { method: "DELETE", headers }
      );
      console.log("Event Complete", eventId);
      setEvents((prev) => prev.filter((e) => e.id != eventId));
      setLoading(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      setLoading(false);
    }
  };

  const createBooking = async (booking) => {
    setLoading(true);
    try {
      const response = await fetch(
        `{process.env.REACT_APP_KLOKO_API}/api.php/booking`,
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(booking),
        }
      );
      const newBooking = await response.json();
      setBookings((prev) => [...prev, newBooking]);
      setLoading(false);
      return [newBooking];
    } catch (error) {
      console.error("Error creating booking:", error);
      setLoading(false);
      return [];
    }
  };

  const updateBooking = async (booking) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/booking/${booking.id}`,
        {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(booking),
        }
      );
      const updatedBooking = await response.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
      );
      setLoading(false);
      return [updatedBooking];
    } catch (error) {
      console.error("Error updating booking:", error);
      setLoading(false);
      return [];
    }
  };

  const deleteBooking = async (bookingId) => {
    setLoading(true);
    try {
      await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/booking/${bookingId}`,
        { method: "DELETE", headers }
      );
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setLoading(false);
    } catch (error) {
      console.error("Error deleting booking:", error);
      setLoading(false);
    }
  };

  const createTemplate = async (template) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/template`,
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(template),
        }
      );
      const newTemplate = await response.json();
      setTemplates((prev) => [...prev, newTemplate]);
      setLoading(false);
      return [newTemplate];
    } catch (error) {
      console.error("Error creating template:", error);
      setLoading(false);
      return [];
    }
  };

  const updateTemplate = async (template) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/template/${template.id}`,
        {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(template),
        }
      );
      const updatedTemplate = await response.json();
      setTemplates((prev) =>
        prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t))
      );
      setLoading(false);
      return [updatedTemplate];
    } catch (error) {
      console.error("Error updating template:", error);
      setLoading(false);
      return [];
    }
  };

  const deleteTemplate = async (templateId) => {
    setLoading(true);
    try {
      await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/template/${templateId}`,
        { method: "DELETE", headers }
      );
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
      setLoading(false);
    } catch (error) {
      console.error("Error deleting template:", error);
      setLoading(false);
    }
  };

  const searchEventListing = async (lat, lng, type, from, to) => {
    setLoading(true);
    console.log("Search TOKEN", token)
    console.log("Search headers", headers)
    try {
      console.log("Start search", lat, lng, type, from, to)
      const response = await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/find?lat=${lat}&lng=${lng}&type=${type}&from=${from}&to=${to}`,
        { headers }
      );
      const data = await response.json();
      console.log("SEARCH DATA", data);
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results (find):", error);
    }
    setLoading(false);
  }
  const randomEventListing = async (lat, lng, type, from, to) => {
    setLoading(true);
    console.log("Search TOKEN", token)
    console.log("Search headers", headers)
    try {
      console.log("Start search", lat, lng, type, from, to)
      const response = await fetch(
        `${process.env.REACT_APP_KLOKO_API}/api.php/random?lat=${lat}&lng=${lng}&type=${type}&from=${from}&to=${to}`,
        { headers }
      );
      const data = await response.json();
      console.log("SEARCH DATA", data);
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results (find):", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    randomEventListing(-26.06,27.9,"Salsa","2024-07-21","2024-07-21")
  }, [user, token]);

  const values = useMemo(
    () => ({
      calendars,
      events,
      bookings,
      templates,
      activeCalendar,
      activeEvent,
      loading,
      searchResults,
      setActiveCalendar,
      setActiveEvent,
      createCalendar,
      updateCalendar,
      deleteCalendar,
      createEvent,
      updateEvent,
      deleteEvent,
      createBooking,
      updateBooking,
      deleteBooking,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      searchEventListing,
    }),
    [
      calendars,
      events,
      bookings,
      templates,
      activeCalendar,
      activeEvent,
      loading,
      searchResults,
    ]
  );

  return (
    <KlokoContext.Provider value={values}>{children}</KlokoContext.Provider>
  );
};

// Custom hook for using the DataContext
export default KlokoProvider;
