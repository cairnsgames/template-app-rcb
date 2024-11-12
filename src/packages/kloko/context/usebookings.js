
import { useContext } from "react";
import { KlokoContext } from "./klokoprovider";

export const useBookings = () => {
  // get the context
  const context = useContext(KlokoContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useUser was used outside of its Provider");
  }

  const { bookings, tickets, createBooking, updateBooking, deleteBooking } = context;

  return { bookings, tickets, createBooking, updateBooking, deleteBooking };
};

export default useBookings;
