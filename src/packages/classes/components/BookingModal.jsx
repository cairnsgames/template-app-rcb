import React, { useState } from "react";
import { X } from "react-bootstrap-icons";
import { useClasses } from "../context/ClassContext";
import { Modal, Button, Form } from "react-bootstrap";
import useCart from "../../breezo/context/usecart";

import { formatDate, formatStartEndTime } from "./functions";

const BookingModal = ({ isOpen, onClose, classData }) => {
  const { updateClass } = useClasses();
  const [formData, setFormData] = useState({
    quantity: 1,
  });
  
    const { addItemToCart } = useCart();

  if (!isOpen) return null;

  const availableSpots =
    classData.max_participants - classData.currentEnrollment;
  const totalCost = formData.quantity * classData.price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addItemToCart(undefined, {
      parent_id: classData.id,
      item_type_id: 3,
      item_id: undefined,
      title: classData.title,
      item_description: classData.title,
      price: classData.price,
      currency: classData.currency,
      quantity: formData.quantity,
    });
    updateClass(classData.id, {
      currentEnrollment: classData.currentEnrollment + formData.quantity,
    });
    onClose();
    window.location.hash = "placeorder";
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book Class</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3 className="h6 mb-2">{classData.title}</h3>
        <div>
          {formatDate(classData.start_time)}
            <span className="ms-1 text-purple-600">
              {formatStartEndTime(classData.start_time,classData.end_time)}
            </span>
        </div>
        <p className="text-muted mb-1">Instructor: {classData.instructor}</p>
        <p className="text-muted mb-1">
          {classData.currency} {classData.price} per participant
        </p>
        <p className="mt-2">
          <span className="fw-bold">Available spots: </span>
          <span className={availableSpots < 5 ? "text-danger" : "text-success"}>
            {availableSpots}
          </span>
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Number of Participants</Form.Label>
            <Form.Control
              type="number"
              required
              min="1"
              max={availableSpots}
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantity: parseInt(e.target.value),
                }))
              }
            />
          </Form.Group>
          <p className="fw-bold">
            Total: {classData.currency} {totalCost}
          </p>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={formData.quantity > availableSpots}
            >
              Add to Cart
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BookingModal;
