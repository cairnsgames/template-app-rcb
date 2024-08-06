import React, { useState, useEffect } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { TrashFill } from "react-bootstrap-icons";
import { useCart } from "./context/usecart";
import { useOrders } from "./context/useorders";
import { useUser } from "../auth/context/useuser";
import PayNowButton from "./paynowbutton";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


// TODO: read paypal client id from settings
const CartToOrder = ({paypalclientId = "Ab0yjA8p7PebhbjRYAr7T1_F2tvN9Rq2B2DH-4Jh9D3EU3nEaG3oRoDJm0aSlWY_Tty1tqr6CbnBLqAr"}) => {
  const {
    carts,
    cartItems,
    fetchCarts,
    loading: cartLoading,
    deleteItem,
  } = useCart();
  const { createOrderFromCart, loading: orderLoading } = useOrders();
  const { properties } = useUser();

  const [address, setAddress] = useState("");
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    fetchCarts();
  }, []);

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

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div>
        <h3>Your Cart</h3>
        <p>Count: {carts[0].count}</p>
        <p>Total: ${carts[0].total}</p>

        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <div>
                {item.title} - ${Number(item.price).toFixed(2)}
                <Button variant="outline-primary" className="float-end">
                  <TrashFill
                    onClick={() => {
                      deleteItem(item.id);
                    }}
                  />
                </Button>
              </div>
              <div style={{ fontSize: "0.8em" }}>{item.start_time}</div>
            </li>
          ))}
        </ul>

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
          <>
            {/* <Button onClick={handlePlaceOrder} disabled={orderLoading}>
            {orderLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Place Order"
            )}
          </Button> */}
            <PayNowButton onGetOrder={getOrder} onPaid={() => setPaid(true)} />
          </>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default CartToOrder;
