
import { useContext } from "react";
import { KlokoMyEventContext } from "./klokomyeventprovider";

export const useBookings = () => {
  // get the context
  const context = useContext(KlokoMyEventContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useUser was used outside of its Provider");
  }

  const { bookings, tickets, createBooking, updateBooking, deleteBooking } = context;

  return { bookings, tickets, createBooking, updateBooking, deleteBooking };
};

export default useBookings;
