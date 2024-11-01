import React, { useState } from "react";
import { Button, Modal, ListGroup, Badge } from "react-bootstrap";
import { CartFill, TrashFill } from "react-bootstrap-icons";
import useCart from "./context/usecart";

const BreezoCart = (props) => {
  const { carts, cartItems, deleteItem } = useCart();
  const [show, setShow] = useState(false);

  // Assuming the first cart is the active one
  const activeCart = carts.length > 0 ? carts[0] : null;
  const itemCount = activeCart ? activeCart.count : 0;
  const cartTotal = activeCart ? Number(activeCart.total) ?? 0 : 0;

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  const deleteAnItem = (id) => {
    deleteItem(id);
  };

  return (
    <div className={`d-inline ${props.className}`} style={props.style}>
      <Button
        variant="primary"
        onClick={handleShow}
        className="position-relative me-1 p-2"
      >
        <CartFill size={24} />
        <Badge
          pill
          bg="info"
          className="position-absolute top-25 start-75 translate-middle"
          style={{ fontSize: "12px" }}
        >
          {itemCount}
          <span className="visually-hidden">cart items</span>
        </Badge>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cart Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartItems.length > 0 ? (
            <ListGroup>
              {cartItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <div>
                    {item.title} - ${Number(item.price).toFixed(2)}
                    <Button variant="outline-primary" className="float-end">
                      <TrashFill
                        onClick={() => {
                          deleteAnItem(item.id);
                        }}
                      />
                    </Button>
                  </div>
                  <div style={{ fontSize: "0.8em" }}>{item.start_time}</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <p>Total: ${cartTotal.toFixed(2)}</p>
        </Modal.Footer>
        <Modal.Footer>
          {cartItems.length > 0 && (
            <Button
              variant="primary"
              onClick={() => {
                window.location.hash = "placeorder";
                handleClose();
              }}
            >
              Pay Now
            </Button>
          )}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BreezoCart;
