import React, { useState } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import { useEvents } from "./context/useevents";
import useBookings from "./context/usebookings";

const KlokoForm = ({ onClose, event }) => {
  const { createBooking, loading } = useBookings();
  const [formData, setFormData] = useState({
    firstName: undefined,
    lastName: undefined,
    phoneNumber: undefined,
    email: undefined,
  });

  const {activeEvent } = useEvents();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBooking = (formData) => {
    const { email, firstName, lastName, phoneNumber } = formData;
    createBooking({event_id: event.id, email, firstName, lastName, phoneNumber});
  };

  return (
    <div className="kloko-booking-form">
      <InputGroup className="mb-3">
        <InputGroup.Text>First Name</InputGroup.Text>
        <Form.Control
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="Enter your first name"
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Last Name</InputGroup.Text>
        <Form.Control
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Enter your last name"
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Phone Number</InputGroup.Text>
        <Form.Control
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Email</InputGroup.Text>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
        />
      </InputGroup>
      <hr />
      <Button
        variant="primary"
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
      </Button>
      <Button
        variant="outline-primary"
        className="kloko-button kloko-button-secondary"
        onClick={onClose}
        style={{ marginLeft: "1rem" }}
      >
        Cancel
      </Button>
      {loading && <p>Booking in progress...</p>}
    </div>
  );
};

export default KlokoForm;
