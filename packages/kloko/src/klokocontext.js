import React, { createContext, useState, useEffect, useContext } from "react";
import { combineUrlAndPath } from "../../../src/functions/combineurlandpath";

export const KlokoContext = createContext();

export const KlokoProvider = ({ appId, eventId, children }) => {
  const [event, setEvent] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          combineUrlAndPath(
            process.env.REACT_APP_KLOKO_API,
            `getevent.php?id=${eventId}`
          ),
          {
            APP_ID: appId,
          }
        );
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError("Failed to fetch event data");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const createBooking = async (
    participantEmail,
    firstname,
    lastname,
    phone
  ) => {
    setLoading(true);
    const bookingData = {
      event_id: eventId,
      email: participantEmail,
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      booking_time: new Date().toISOString().slice(0, 19).replace("T", " "),
      status: "anon",
    };

    try {
      const response = await fetch(
        combineUrlAndPath(process.env.REACT_APP_KLOKO_API, `anonbooking.php`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            APP_ID: appId,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      const result = await response.json();
      setBookingStatus("Booking successful");
      return result;
    } catch (err) {
      setError("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KlokoContext.Provider
      value={{ event, bookingStatus, createBooking, loading, error }}
    >
      {children}
    </KlokoContext.Provider>
  );
};
