
import { useContext } from "react";
import { KlokoContext } from "./klokoprovider";

export const useBookings = () => {
  // get the context
  const context = useContext(KlokoContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useUser was used outside of its Provider");
  }

  const { bookings, createBooking, updateBooking, deleteBooking } = context;

  return { bookings, createBooking, updateBooking, deleteBooking };
};

export default useBookings;
