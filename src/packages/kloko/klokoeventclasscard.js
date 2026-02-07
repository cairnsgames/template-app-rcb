import React from "react";
import { Button, Card } from "react-bootstrap";
import useCart from "../breezo/context/usecart";

const EventClassCard = ({ cls, variant }) => {
  const { addItemToCart } = useCart();

  const handleAddToCart = async () => {
    await addItemToCart(null, {
      parent_id: cls.id,
      item_type_id: 1,
      item_id: cls.id,
      title: cls.title,
      item_description: cls.description,
      price: cls.price.toString(),
      quantity: 1,
    });
  };

  const canBook = cls.participants < cls.max_participants;
  return (
    <div style={{ position: "relative" }}>
      <Card className="mt-2">
        <Card.Header>{cls.title}</Card.Header>
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <div>
              {cls.start_time} - {cls.end_time}
            </div>
            {cls.description && <div className="mt-1">{cls.description}</div>}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>Price: {cls.price}</div>
            <div>
              <Button
                variant={variant || "primary"}
                onClick={handleAddToCart}
                disabled={!canBook}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {!canBook && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "30px",
            top: "50%",
            transform: "translateY(-50%) rotate(45deg)",
            background: "rgba(245,245,245,0.6)", // lighter, slightly opaque
            color: "rgba(120,120,120,0.9)", // lighter text
            padding: "6px 60px", // shorter bar
            fontWeight: 700,
            pointerEvents: "none",
            zIndex: 10,
            textTransform: "uppercase",
            letterSpacing: "1px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            borderRadius: 2,
          }}
        >
          Sold Out
        </div>
      )}
    </div>
  );
};

export default EventClassCard;
