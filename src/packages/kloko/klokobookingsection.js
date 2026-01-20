import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import useBookings from "./context/usebookings";
import useEvents from "./context/useevents";
import useUser from "../auth/context/useuser";
import eventing from "../eventing/eventing";
import useTenant from "../tenant/context/usetenant";
import useCart from "../breezo/context/usecart";

const BookingSection = (props) => {
  const { cancelBooking } = useBookings();
  const { user } = useUser();
  const { tenant } = useTenant();
  const { ticketTypes, ticketOptions } = useEvents();
  const { fetchOrCreateCart, addItemToCart } = useCart();
  const [cart, setCart] = useState(null);
  const { event } = props;
  const [quantity, setQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState(
    ticketTypes?.length > 0 ? ticketTypes[0].id : null
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (ticketTypes?.length > 0 && !selectedTicketType) {
      setSelectedTicketType(ticketTypes[0].id);
    }
  }, [ticketTypes]);

  const fetchCart = async () => {
    if (user?.id) {
      const cartData = await fetchOrCreateCart();
      setCart(cartData);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        console.log("Clear Message");
        setAlertMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  if (event.paid >= 1) {
    return <strong>You have Paid!</strong>;
  }
  if (event.booked >= 1) {
    return <strong>You have booked, awaiting payment!</strong>;
  }
  if (event.bookings >= event.max_participants) {
    return <strong>Event is full</strong>;
  }

  const handleClose = () => {
    window.location.hash = "#home";
  };

  const handleAddToCart = async () => {
    if (!cart?.id) {
      return;
    }

    setIsButtonDisabled(true);

    try {
      // Add ticket type or event price
      if (ticketTypes?.length > 0) {
        const selectedType = ticketTypes.find(
          (t) => t.id === selectedTicketType
        );
        if (selectedType) {
          await addItemToCart(cart.id, {
            parent_id: event.id,
            item_type_id: 3,
            item_id: selectedType.id,
            title: event.title,
            item_description: selectedType.name,
            price: selectedType.price.toString(),
            quantity: quantity,
          });
        }
      } else {
        await addItemToCart(cart.id, {
          parent_id: event.id,
          item_type_id: 1,
          item_id: event.id,
          title: event.title,
          item_description: event.title,
          price: event.price.toString(),
          quantity: quantity,
        });
      }

      // Add selected options
      for (const optionId of selectedOptions) {
        const option = ticketOptions.find((opt) => opt.id === optionId);
        if (option) {
          await addItemToCart(cart.id, {
            parent_id: event.id,
            item_type_id: 4,
            item_id: option.id,
            title: event.title,
            item_description: option.name,
            price: option.price.toString(),
            quantity: quantity,
          });
        }
      }

      // Show success message
      setAlertMessage("Your tickets have been added to your cart");

      eventing.publish("breezo", "reload", cart);
    } catch (error) {
      console.error("Error adding items to cart:", error);
    }
  };

  const handleOptionChange = (optionId) => {
    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      }
      return [...prev, optionId];
    });
  };

  return (
    <Form>
      {ticketTypes?.length > 0 ? (
        <>
          <Form.Group className="mb-3">
            {ticketTypes.map((type) => (
              <Form.Check
                key={type.id}
                type="radio"
                id={`ticket-type-${type.id}`}
                name="ticketType"
                label={`${type.name} - ${type.currency} ${type.price}`}
                checked={selectedTicketType === type.id}
                onChange={() => setSelectedTicketType(type.id)}
              />
            ))}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </Form.Group>
        </>
      ) : (
        <Form.Group className="mb-3">
          {/* <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          <Form.Text>
            Price: {event.currency} {event.price}
          </Form.Text> */}
        </Form.Group>
      )}

      {ticketOptions?.length > 0 && (
        <Form.Group className="mb-3">
          <Form.Label>Additional Options</Form.Label>
          {ticketOptions.map((option) => (
            <Form.Check
              key={option.id}
              type="checkbox"
              id={`option-${option.id}`}
              label={`${option.name} - ${option.currency} ${option.price}`}
              checked={selectedOptions.includes(option.id)}
              onChange={() => handleOptionChange(option.id)}
            />
          ))}
        </Form.Group>
      )}

      {event.enable_bookings === "Y" && (
        <>
          {alertMessage && (
            <Alert variant="success" className="w-100">
              {alertMessage}
            </Alert>
          )}
          <div className="d-flex align-items-center justify-content-end gap-3">
            <div>
              Total:{" "}
              {ticketTypes?.length > 0
                ? `${
                    ticketTypes.find((t) => t.id === selectedTicketType)
                      ?.currency
                  } ${
                    ((ticketTypes.find((t) => t.id === selectedTicketType)
                      ?.price || 0) +
                      selectedOptions.reduce(
                        (sum, optId) =>
                          sum +
                          (ticketOptions.find((opt) => opt.id === optId)?.price ||
                            0),
                        0
                      )) *
                    quantity
                  }`
                : `${event.currency} ${
                    (event.price +
                      selectedOptions.reduce(
                        (sum, optId) =>
                          sum +
                          (ticketOptions.find((opt) => opt.id === optId)?.price ||
                            0),
                        0
                      )) *
                    quantity
                  }`}
            </div>
            <Button
              variant="primary"
              onClick={handleAddToCart}
              // disabled={isButtonDisabled} // Decide later if this is required - do not delete
            >
              Add to Cart
            </Button>
            {isButtonDisabled && (
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            )}
          </div>
        </>
      )}
    </Form>
  );
};

export default BookingSection;
