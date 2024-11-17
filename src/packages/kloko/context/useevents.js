
import { useContext } from "react";
import { KlokoEventContext } from "./klokoeventprovider";

export const useEvents = () => {
  // get the context
  const context = useContext(KlokoEventContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useEvents was used outside of its Provider");
  }

  const { events, createEvent, fetchEvents, fetchEventById, updateEvent, deleteEvent } = context;

  return { events, createEvent, fetchEvents, fetchEventById, updateEvent, deleteEvent };
};

export default useEvents;
