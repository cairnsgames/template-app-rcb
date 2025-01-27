
import { useContext } from "react";
import { KlokoMyEventContext } from "./klokomyeventprovider";

export const useMyEvents = () => {
  // get the context
  const context = useContext(KlokoMyEventContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useEvents was used outside of its Provider");
  }

  const { myEvents, upcomingEvents, createEvent, fetchEvents, fetchEventById, updateEvent, deleteEvent } = context;

  return { myEvents, upcomingEvents, createEvent, fetchEvents, fetchEventById, updateEvent, deleteEvent };
};

export default useMyEvents;
