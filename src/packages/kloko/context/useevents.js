import { useContext } from 'react';
import { KlokoMyEventContext } from './klokomyeventprovider';

export const useEvents = () => {
  // get the context
  const context = useContext(KlokoMyEventContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useEvents was used outside of its Provider");
  }

  const { classes, events, setEventId, activeEvent, ticketTypes, ticketOptions, toggleFavorite, location, setLocation } = context;

  return { classes, events, setEventId, activeEvent, ticketTypes, ticketOptions, toggleFavorite, location, setLocation };
}

export default useEvents;

