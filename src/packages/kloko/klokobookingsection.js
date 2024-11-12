import React from "react";
import { Button } from "react-bootstrap";
import useBookings from "./context/usebookings";
import useSearch from "./context/usesearch";

const BookingSection = (props) => {
  const { createBooking } = useBookings();
  const { refetchSearch } = useSearch();
  const { event } = props;

  const makeBooking = async () => {
    await createBooking({
      event_id: event.id,
    });
    refetchSearch();
  };
  if (event.paid >= 1) {
    return <strong>You have Paid!</strong>;
  }
  if (event.booked >= 1) {
    return <strong>You have booked, awaiting payment!</strong>;
  }
  if (event.bookings >= event.max_participants) {
    return <strong>Event is full</strong>;
  }

  return <Button onClick={makeBooking}>Book now!</Button>;
};

export default BookingSection;
