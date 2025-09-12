import { useContext } from 'react';
import { KlokoMyEventContext } from './klokomyeventprovider';

export const useEvents = () => {
  // get the context
  const context = useContext(KlokoMyEventContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useEvents was used outside of its Provider");
  }

  const { events, setEventId, activeEvent, ticketTypes, ticketOptions, toggleFavorite } = context;

  return { events, setEventId, activeEvent, ticketTypes, ticketOptions, toggleFavorite };
}

export default useEvents;

