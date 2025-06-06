import { useContext } from 'react';
import { KlokoEventsContext } from './klokoeventsprovider';

export const useEvents = () => {
  // get the context
  const context = useContext(KlokoEventsContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useEvents was used outside of its Provider");
  }

  const { events, setEventId, activeEvent } = context;

  return { events, setEventId, activeEvent };
}

