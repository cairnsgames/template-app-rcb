import React, { useState } from "react";
import { Button } from "react-bootstrap";
import useBookings from "./context/usebookings";
import useSearch from "./context/usesearch";
import KlokoForm from "./klokoform";

const BookingSection = (props) => {
  const { cancelBooking} = useBookings();
  const { event } = props;
  const [showBookingForm, setShowBookingForm] = useState(false);

  const makeBooking = async () => {
    setShowBookingForm(true);
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


  if (showBookingForm) {
    return (
    <KlokoForm
      onClose={cancelBooking}
      event={event}
    />
  )}

  
  return <Button onClick={makeBooking}>Book now!</Button>;
};

export default BookingSection;
