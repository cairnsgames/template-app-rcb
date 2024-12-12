import React, { createContext, useState, useEffect, useMemo } from "react";
import eventing from "../../eventing/eventing";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";

// Create context for Calendar, Event, Booking, and Template management
export const KlokoEventContext = createContext();
/* An event has the following fields (Keep this comment)
// 'id', 'calendar_id', 'user_id', 'event_template_id', 'content_id', 'app_id', 'title', 'description', 'price', 'image', 'keywords', 'event_type', 'duration', 'location', 'lat', 'lng', 'max_participants', 'start_time', 'end_time'
// where image is a file path - usung the file uploader to create.
*/

// Data provider component
export const KlokoEventProvider = ({
  children,
  user,
  tenant,
  token,
  useFeatureFlags,
  useSettings,
}) => {
  const [calendars, setCalendars] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [userBookings, setUserBookings] = useState([]); // New state for user bookings
  const [templates, setTemplates] = useState([]);
  const [activeCalendar, setActiveCalendar] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [headers, setHeaders] = useState({});
  const [canFetch, setCanFetch] = useState(false);
  const [setsearchCriteria, setSearchCriteria] = useState({});

  if (!process.env.REACT_APP_KLOKO_API) {
    throw new Error(
      "KlokoProvider: REACT_APP_KLOKO_API environment variable is required"
    );
  }

  useEffect(() => {
    setHeaders({ APP_ID: tenant, token: token });
    setCanFetch(!!user && !!tenant && token !== "");
  }, [user, tenant, token]);

  useEffect(() => {
    if (canFetch) {
      fetchCalendars();
      fetchTemplates();
      fetchUserBookings(); // Fetch user bookings on initial load
    }
  }, [canFetch]);

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

  // Fetch user bookings
  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/user/${user.id}/bookings`
        ),
        { headers }
      );
      const data = await response.json();
      setUserBookings(data);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
    }
    setLoading(false);
  };

  // Fetch calendars
  const fetchCalendars = async () => {
    if (!user) {
      console.warning("NO USER");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/user/${user.id}/calendars`
        ),
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
  const fetchEvents = async (calendarId = activeCalendar.id) => {
    setLoading(true);
    fetch(
      combineUrlAndPath(
        process.env.REACT_APP_KLOKO_API,
        `api.php/calendar/${calendarId}/events`
      ),
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

  // Fetch event by ID
  const fetchEventById = (id) => {
    return events.find(event => event.id === id) || null; // Search for the event by ID
  };

  // Fetch bookings
  const fetchBookings = async (eventId) => {
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/event/${eventId}/bookings`
        ),
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
    if (!canFetch) {
      setTemplates([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/user/${user.id}/templates`
        ),
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
        combineUrlAndPath(process.env.REACT_APP_KLOKO_API, `api.php/calendar`),
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
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/calendar/${calendar.id}`
        ),
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
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/calendar/${calendarId}`
        ),
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
        combineUrlAndPath(process.env.REACT_APP_KLOKO_API, `api.php/event`),
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(event),
        }
      );
      let newEvent = await response.json();
      newEvent = newEvent.map((event) => {
        event.start = event.start_time;
        event.end = event.end_time;
        return event;
      });
      setEvents((prev) => [...prev, ...newEvent]);
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
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/event/${event.id}`
        ),
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
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/event/${eventId}`
        ),
        { method: "DELETE", headers }
      );
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
        combineUrlAndPath(process.env.REACT_APP_KLOKO_API, `api.php/booking`),
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(booking),
        }
      );
      const newBooking = await response.json();
      setBookings((prev) => [...prev, newBooking]);
      setLoading(false);
      eventing.publish("breezo", "reload", newBooking);
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
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/booking/${booking.id}`
        ),
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
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/booking/${bookingId}`
        ),
        { method: "DELETE", headers }
      );
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setLoading(false);
    } catch (error) {
      console.error("Error deleting booking:", error);
      setLoading(false);
    }
  };

  const addTemplate = async (template) => {
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(process.env.REACT_APP_KLOKO_API, `api.php/template`),
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(template),
        }
      );
      const newTemplate = await response.json();
      // setTemplates((prev) => [...prev, newTemplate]);
      fetchTemplates();
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
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/template/${template.id}`
        ),
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
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/template/${templateId}`
        ),
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
    setSearchCriteria({ lat, lng, type, from, to });
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/find?lat=${lat}&lng=${lng}&type=${type}&from=${from}&to=${to}`
        ),
        { headers }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(
        "Error fetching search results (searchEventListing):",
        error
      );
    }
    setLoading(false);
  };
  const refetchSearch = () => {
    searchEventListing(
      setsearchCriteria.lat,
      setsearchCriteria.lng,
      setsearchCriteria.type,
      setsearchCriteria.from,
      setsearchCriteria.to
    );
  };
  const randomEventListing = async (lat, lng, type, from, to) => {
    if (!canFetch) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_KLOKO_API,
          `api.php/random?lat=${lat}&lng=${lng}&type=${type}&from=${from}&to=${to}`
        ),
        { headers }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(
        "Error fetching search results (randomEventListing):",
        error,
        headers
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    randomEventListing(-26.06, 27.9, "Salsa", "2024-07-21", "2024-07-21");
  }, [user, token]);

  // Computed variable for tickets
  const tickets = userBookings.filter((booking) => booking.status === "paid");

  const values = useMemo(
    () => ({
      calendars,
      events,
      bookings,
      userBookings, 
      tickets, 
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
      fetchEvents,
      fetchEventById,
      createBooking,
      updateBooking,
      deleteBooking,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      searchEventListing,
      refetchSearch,
    }),
    [
      calendars,
      events,
      bookings,
      userBookings, // Add userBookings to dependencies
      tickets, // Add tickets to dependencies
      templates,
      activeCalendar,
      activeEvent,
      loading,
      searchResults,
    ]
  );

  return (
    <KlokoEventContext.Provider value={values}>{children}</KlokoEventContext.Provider>
  );
};

// Custom hook for using the DataContext
export default KlokoEventProvider;