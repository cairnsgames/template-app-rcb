import React, { useState } from "react";
import { useKloko } from "./usekloko";

const KlokoForm = ({ onClose }) => {
  const { createBooking, loading } = useKloko();
  const [formData, setFormData] = useState({
    firstName: undefined,
    lastName: undefined,
    phoneNumber: undefined,
    email: undefined,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBooking = (formData) => {
    const { email, firstName, lastName, phoneNumber } = formData;
    createBooking(email, firstName, lastName, phoneNumber);
    setShowBookingForm(false);
  };

  return (
    <div className="kloko-booking-form">
      <input
        type="text"
        className="kloko-input"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        placeholder="Enter your first name"
      />
      <input
        type="text"
        className="kloko-input"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        placeholder="Enter your last name"
      />
      <input
        type="tel"
        className="kloko-input"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        placeholder="Enter your phone number"
      />
      <input
        type="email"
        className="kloko-input"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Enter your email"
      />
      <hr/>
      <button
        className="kloko-button kloko-button-primary"
        onClick={() => handleBooking(formData)}
        disabled={
          loading ||
          !formData.email ||
          !formData.firstName ||
          !formData.lastName ||
          !formData.phoneNumber
        }
      >
        Confirm Booking
      </button>
      <button
        className="kloko-button kloko-button-secondary"
        onClick={onClose}
        style={{ marginLeft: "1rem" }}
      >
        Cancel
      </button>
      {loading && <p>Booking in progress...</p>}
    </div>
  );
};

export default KlokoForm;
