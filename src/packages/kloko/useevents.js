
import { useContext } from "react";
import { KlokoContext } from "./klokoprovider";

export const useEvents = () => {
  // get the context
  const context = useContext(KlokoContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useUser was used outside of its Provider");
  }

  const { events, createEvent, updateEvent, deleteEvent } = context;

  return { events, createEvent, updateEvent, deleteEvent };
};

export default useEvents;
