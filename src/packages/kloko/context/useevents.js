
import { useContext } from "react";
import { KlokoContext } from "./klokoprovider";

export const useEvents = () => {
  // get the context
  const context = useContext(KlokoContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useEvents was used outside of its Provider");
  }

  const { events, createEvent, fetchEvents, fetchEventById, updateEvent, deleteEvent } = context;

  return { events, createEvent, fetchEvents, fetchEventById, updateEvent, deleteEvent };
};

export default useEvents;
