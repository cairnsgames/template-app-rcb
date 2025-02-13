import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import useBookings from "./context/usebookings";
import useMyEvents from "./context/usemyevents";
import useUser from "../auth/context/useuser";
import eventing from "../eventing/eventing";

const BookingSection = (props) => {
  const { cancelBooking } = useBookings();
  const { user } = useUser();
  const { ticketTypes, ticketOptions } = useMyEvents();
  const [cart, setCart] = useState(null);
  const { event } = props;
  const [quantity, setQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState(ticketTypes?.length > 0 ? ticketTypes[0].id : null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (ticketTypes?.length > 0 && !selectedTicketType) {
      setSelectedTicketType(ticketTypes[0].id);
    }
  }, [ticketTypes]);

  useEffect(() => {
    const fetchOrCreateCart = async () => {
      try {
        // Try to fetch existing cart
        const response = await fetch(`https://cairnsgames.co.za/php/breezo/api.php/user/${user.id}/cart`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCart(data[0]);
        } else {
          // Create new cart if none exists
          const createResponse = await fetch('https://cairnsgames.co.za/php/breezo/api.php/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: user.id }),
          });
          const newCart = await createResponse.json();
          setCart(newCart);
        }
      } catch (error) {
        console.error('Error fetching/creating cart:', error);
      }
    };

    if (user?.id) {
      fetchOrCreateCart();
    }
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
    console.log("Adding to cart", cart)
    if (!cart?.id) return;

    try {
      const addItemToCart = async (itemData) => {
        console.log("Add item to cart", itemData);
        await fetch('https://cairnsgames.co.za/php/breezo/api.php/cart_item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cart_id: cart.id,
            ...itemData
          }),
        });
      };

      // Add ticket type or event price
      if (ticketTypes?.length > 0) {
        const selectedType = ticketTypes.find(t => t.id === selectedTicketType);
        console.log("Selected type", selectedType);
        if (selectedType) {
          await addItemToCart({
            item_type_id: 3,
            item_id: selectedType.id,
            title: event.title,
            item_description: selectedType.name,
            price: selectedType.price.toString(),
            quantity: quantity,
          });
        }
      } else {
        await addItemToCart({
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
        const option = ticketOptions.find(opt => opt.id === optionId);
        if (option) {
          await addItemToCart({
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
      console.error('Error adding items to cart:', error);
    }
  };

  const handleOptionChange = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
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
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          <Form.Text>Price: {event.currency} {event.price}</Form.Text>
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

      <div className="d-flex align-items-center justify-content-end gap-3">
        <div>
          Total: {ticketTypes?.length > 0 
            ? `${ticketTypes.find(t => t.id === selectedTicketType)?.currency} ${
                ((ticketTypes.find(t => t.id === selectedTicketType)?.price || 0) + 
                selectedOptions.reduce((sum, optId) => 
                  sum + (ticketOptions.find(opt => opt.id === optId)?.price || 0), 0)) * quantity
              }`
            : `${event.currency} ${(event.price + 
                selectedOptions.reduce((sum, optId) => 
                  sum + (ticketOptions.find(opt => opt.id === optId)?.price || 0), 0)) * quantity
              }`
          }
        </div>
        <Button variant="primary" onClick={handleAddToCart}>Add to Cart</Button>
      </div>
    </Form>
  );
};

export default BookingSection;
