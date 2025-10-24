import { createContext, useContext, useState, useEffect } from 'react';
import { mockEvents } from './mockmycalendar';

const EventContext = createContext(undefined);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setEvents(mockEvents);
  };

  const getEventsForDate = (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= startOfDay && eventDate <= endOfDay;
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const getNextEventDate = (fromDate) => {
    const startOfNextDay = new Date(fromDate);
    startOfNextDay.setHours(0, 0, 0, 0);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    const futureEvents = events
      .filter(event => new Date(event.startTime) >= startOfNextDay)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

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
      .filter(event => {
        const eventDate = new Date(event.startTime);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < startOfCurrentDay;
      })
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    if (pastEvents.length > 0) {
      const prevEventDate = new Date(pastEvents[0].startTime);
      prevEventDate.setHours(0, 0, 0, 0);
      return prevEventDate;
    }

    return null;
  };

  return (
    <EventContext.Provider value={{ events, currentDate, setCurrentDate, getEventsForDate, getNextEventDate, getPreviousEventDate }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
