import React, { useState } from "react";
import { useKloko } from "./usekloko";
import KlokoForm from "./klokoform";

const KlokoEvent = () => {
    const { event, bookingStatus, loading, error } = useKloko();
    const [showDetails, setShowDetails] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
  
    const toggleDetails = () => {
      setShowDetails(true);
    };
  
    const toggleBookingForm = () => {
      setShowBookingForm((prev) => !prev);
    };
  
    const cancelBooking = () => {
      setShowBookingForm(false);
    };
  
    return (
      <div className="kloko-event-box">
        {loading && <p>Loading event details...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {event && (
          <>
            <div className="kloko-event-container">
              {/* Display the image if event.image exists */}
              {event.image && (
                <div className="kloko-event-image">
                  <img
                    src={`${process.env.REACT_APP_KLOKO_IMAGES}${event.image}`}
                    alt={event.title}
                  />
                </div>
              )}
  
              <div className="kloko-event-content">
                {/* Display event details */}
                <h2 className="kloko-event-title">{event.title}</h2>
                <p className="kloko-event-detail-item">
                  <strong>Date & Time:</strong>{" "}
                  {new Date(event.start_time).toLocaleString()}
                </p>
  
                {/* Conditionally render "More" button */}
                {!showDetails && (
                  <button
                    className="kloko-button kloko-button-secondary"
                    onClick={toggleDetails}
                  >
                    More
                  </button>
                )}
  
                {/* Show additional details when the 'More' button is clicked */}
                {showDetails && (
                  <div className="kloko-event-details">
                    <p className="kloko-event-description">{event.description}</p>
                    <p className="kloko-event-detail-item">
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p className="kloko-event-detail-item">
                      <strong>Duration:</strong> {event.duration} minutes
                    </p>
                    <p className="kloko-event-detail-item">
                      <strong>Price:</strong> ${event.price}
                    </p>
                    <p className="kloko-event-detail-item">
                      <strong>Places Available:</strong> {event.available} of{" "}
                      {event.max_participants}
                    </p>
  
                    {/* Book button */}
                    <button
                      className="kloko-button kloko-button-primary"
                      onClick={toggleBookingForm}
                    >
                      Book
                    </button>
  
                    {/* Show booking form when 'Book' button is clicked */}
                    {showBookingForm && (
                      <KlokoForm
                        onClose={cancelBooking}
                      />
                    )}
                  </div>
                )}
                {bookingStatus && <p>{bookingStatus}</p>}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

export default KlokoEvent;