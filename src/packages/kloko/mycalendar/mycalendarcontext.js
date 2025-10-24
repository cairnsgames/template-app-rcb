import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "../../auth/context/useuser";
import { useTenant } from "../../tenant/context/usetenant";

const EventContext = createContext(undefined);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState();

  const { tenant } = useTenant();
  const { user, token } = useUser();

  useEffect(() => {
    // fetch when tenant/token available or on mount
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant, token]);

  const parseDateTime = (s) => {
    if (!s) return null;
    // API returns 'YYYY-MM-DD HH:mm:SS' — convert to ISO-like string
    const iso = s.replace(" ", "T");
    const d = new Date(iso);
    if (isNaN(d.getTime())) return new Date(s);
    return d;
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const headers = {
        app_id: tenant || "",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(
        "https://cairnsgames.co.za/php/kloko/api.php/mycalendar",
        { headers }
      );
      if (!res.ok) {
        // fallback: keep events empty
        setEvents([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        setEvents([]);
        setLoading(false);
        return;
      }

      // Map API items to internal event shape used by EventList
      const mapped = data.map((it, idx) => {
        const start = parseDateTime(it.start_time || it.startTime || it.start);

        const uniqueId = it.event_id
          ? `${it.event_id}_${it.ticket_id ?? idx}`
          : it.id ?? idx;

        return {
          id: uniqueId,
          name: it.title ?? it.name ?? `Event ${it.event_id ?? idx}`,
          description: it.description ?? "",
          currency: it.currency,
          price: Number(it.price) || 0,
          image: it.image,
          keywords: it.keywords,
          type:
            it.enable_bookings === "Y" ? "booked" : it.event_type || "event",
          duration: Number(it.duration) || 0,
          location: it.location || "",
          lat: Number(it.lat) || 0,
          lng: Number(it.lng) || 0,
          startTime: start, // Date object
          endTime: parseDateTime(it.end_time || it.endTime),
          raw: it,
        };
      });

      setEvents(mapped);
      let tempNextDate;
      // set currentDate to first future event's day if user hasn't chosen a date
      try {
        const now = new Date();
        const firstFuture = mapped
          .map((e) => ({
            ...e,
            startTime: e.startTime ? new Date(e.startTime) : null,
          }))
          .filter((e) => e.startTime && e.startTime >= now)
          .sort((a, b) => a.startTime - b.startTime)[0];

        if (firstFuture) {
          const day = new Date(firstFuture.startTime);
          day.setHours(0, 0, 0, 0);
          const initialToday = new Date();
          initialToday.setHours(0, 0, 0, 0);
          const currDay = new Date(currentDate);
          currDay.setHours(0, 0, 0, 0);
          tempNextDate = day;
        }
      } catch (err) {
        // ignore
        tempNextDate = new Date();
      }
      setCurrentDate(tempNextDate || new Date());
    } catch (err) {
      // on error keep existing events or set empty
      setCurrentDate(new Date());
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getEventsForDate = (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return events
      .filter((event) => {
        const eventDate = new Date(event.startTime);
        return eventDate >= startOfDay && eventDate <= endOfDay;
      })
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  };

  const getNextEventDate = (fromDate) => {
    const startOfNextDay = new Date(fromDate);
    startOfNextDay.setHours(0, 0, 0, 0);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    const futureEvents = events
      .filter((event) => new Date(event.startTime) >= startOfNextDay)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

    if (futureEvents.length > 0) {
      const nextEventDate = new Date(futureEvents[0].startTime);
      nextEventDate.setHours(0, 0, 0, 0);
      return nextEventDate;
    }

    return null;
  };

  const getPreviousEventDate = (fromDate) => {
    const startOfCurrentDay = new Date(fromDate);
    startOfCurrentDay.setHours(0, 0, 0, 0);

    const pastEvents = events
      .filter((event) => {
        const eventDate = new Date(event.startTime);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < startOfCurrentDay;
      })
      .sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );

    if (pastEvents.length > 0) {
      const prevEventDate = new Date(pastEvents[0].startTime);
      prevEventDate.setHours(0, 0, 0, 0);
      return prevEventDate;
    }

    return null;
  };

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        currentDate,
        setCurrentDate,
        getEventsForDate,
        getNextEventDate,
        getPreviousEventDate,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
