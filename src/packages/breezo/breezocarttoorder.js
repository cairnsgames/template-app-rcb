import React, { useState, useEffect } from "react";
import { Button, Form, Spinner, Alert, ListGroup } from "react-bootstrap";
import { TrashFill } from "react-bootstrap-icons";
import { useCart } from "./context/usecart";
import { useOrders } from "./context/useorders";
import { useUser } from "../auth/context/useuser";
import PayNowButton from "./paynowbutton";
import PayGate from "./paygate";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


// TODO: read paypal client id from settings
const CartToOrder = ({paypalclientId = "Ab0yjA8p7PebhbjRYAr7T1_F2tvN9Rq2B2DH-4Jh9D3EU3nEaG3oRoDJm0aSlWY_Tty1tqr6CbnBLqAr"}) => {
  const {
    carts,
    cartItems,
    loading: cartLoading,
    deleteItem,
  } = useCart();
  const { createOrderFromCart, loading: orderLoading } = useOrders();
  const { properties } = useUser();

  const [address, setAddress] = useState("");
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [paid, setPaid] = useState(false);

  const doPaid = () => {
    setPaid(true);
  }

  useEffect(() => {
    if (useDefaultAddress && properties) {
      const defaultAddress = properties.find((prop) => prop.name === "address");
      if (defaultAddress) {
        setAddress(defaultAddress.value);
      }
    }
  }, [properties, useDefaultAddress]);

  const requiresAddress = cartItems.some((item) => item.item_type_id !== 1);
  const readyToPlaceOrder = !requiresAddress || (requiresAddress && address);

  if (cartLoading) {
    return <Spinner animation="border" />;
  }

  if (!cartItems.length) {
    return <p>No items in cart.</p>;
  }

  const needAddress = cartItems.some((item) => item.item_type_id !== 1) > 0;

  const getOrder = async () => {
    const order = await createOrderFromCart(carts[0].id, address);
    return order;
  };

  const initialOptions = {
    clientId:
      paypalclientId,
    currency: "USD",
  };

  const calculateTotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);
  const currency = cartItems[0].currency || "ZAR";

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="mt-3">
        <h3>Your Cart</h3>

        <ListGroup>
          {cartItems.map((item) => (
            <ListGroup.Item key={item.id}>
              <div>
                {item.quantity} x {item.title} - {item.currency}{Number(item.price).toFixed(2)}
                <Button
                  variant="outline-primary"
                  className="float-end"
                  onClick={() => {
                    deleteItem(item.id);
                  }}
                  size="sm"
                >
                  <TrashFill />
                </Button>
              </div>
              <div style={{ fontSize: "0.8em" }}>{item.start_time}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <div className="text-end mt-2">
          Total: <strong>{currency}{calculateTotal}</strong>
        </div>

        {needAddress && (
          <Form>
            <Form.Group controlId="address">
              <Form.Label>Delivery Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={useDefaultAddress}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Use default address"
              checked={useDefaultAddress}
              onChange={(e) => setUseDefaultAddress(e.target.checked)}
            />
          </Form>
        )}

        {!readyToPlaceOrder && <Alert variant="danger">Please enter an address</Alert>}

        {!paid && (
          <div className="mt-3">
            <PayGate onGetOrder={getOrder} onPaid={doPaid} />
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default CartToOrder;
