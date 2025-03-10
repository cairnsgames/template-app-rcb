import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import useBookings from "./context/usebookings";
import useMyEvents from "./context/usemyevents";
import useUser from "../auth/context/useuser";
import eventing from "../eventing/eventing";
import useTenant from "../tenant/context/usetenant";
import useCart from "../breezo/context/usecart";

const BookingSection = (props) => {
  const { cancelBooking } = useBookings();
  const { user } = useUser();
  const { tenant } = useTenant();
  const { TicketTypes, TicketOptions } = useMyEvents();
  const { fetchOrCreateCart, addItemToCart } = useCart();
  const [cart, setCart] = useState(null);
  const { event } = props;
  const [quantity, setQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState(
    ticketTypes?.length > 0 ? ticketTypes[0].id : null
  );
  const [selectedOptions, setSelectedOptions] = useState([]);

  console.log("TicketTypes", TicketTypes);
  console.log("TicketOptions", TicketOptions);
  const { data: ticketTypes, loading: ticketTypesLoading } = TicketTypes;
  const { data: ticketOptions, loading: ticketOptionsLoading } = TicketOptions;

  useEffect(() => {
    if (ticketTypes?.length > 0 && !selectedTicketType) {
      setSelectedTicketType(ticketTypes[0].id);
    }
  }, [ticketTypes]);

  const fetchCart = async() => {
    if (user?.id) {
      const cartData = await fetchOrCreateCart();
      setCart(cartData);
    }
  }

  useEffect(() => {
    console.log("User Changed", user);
    fetchCart();
  }, [user]);

  if (event.paid >= 1) {
    return <strong>You have Paid!</strong>;
  }
  if (event.booked >= 1) {
    return <strong>You have booked, awaiting payment!</strong>;
  }
  if (event.bookings >= event.max_participants) {
    return <strong>Event is full</strong>;
  }

  const handleAddToCart = async () => {
    console.log("Adding to cart", cart);
    if (!cart?.id) { console.log("No Cart"); return;}

    try {
      // Add ticket type or event price
      if (ticketTypes?.length > 0) {
        const selectedType = ticketTypes.find(
          (t) => t.id === selectedTicketType
        );
        console.log("Selected type", selectedType);
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

      // Could trigger a cart refresh or show success message here

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
      {ticketTypesLoading && <div>Loading ticket types...</div>}
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

      {ticketOptionsLoading && <div>Loading ticket options...</div>}
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

      <div className="d-flex align-items-center justify-content-end gap-3">
        <div>
          Total:{" "}
          {ticketTypes?.length > 0
            ? `${
                ticketTypes.find((t) => t.id === selectedTicketType)?.currency
              } ${
                ((ticketTypes.find((t) => t.id === selectedTicketType)?.price ||
                  0) +
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
        <Button variant="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </Form>
  );
};

export default BookingSection;
