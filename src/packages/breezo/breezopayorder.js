import React, { useEffect } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { useOrders } from "./context/useorders";
import useUser from "../auth/context/useuser";
import PayNowButton from "./paynowbutton";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const BreezoPayNow = ({ id }) => {
  const { activeOrder, setActiveOrderId, orderItems, loading } = useOrders();
  const { user } = useUser();

  useEffect(() => {
    if (user && id) {
      console.log("==== setting active order id", id);
      setActiveOrderId(id);
    }
  }, [id, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!activeOrder) {
    return <div>Order cannot be found.</div>;
  }

  const getOrder = async () => {
    return activeOrder;
  };
  const doPaid = () => {
    console.log("PAID");
  };

  const paypalclientId =
    "Ab0yjA8p7PebhbjRYAr7T1_F2tvN9Rq2B2DH-4Jh9D3EU3nEaG3oRoDJm0aSlWY_Tty1tqr6CbnBLqAr";

  const initialOptions = {
    clientId: paypalclientId,
    currency: "USD",
  };

  return (
    <PayPalScriptProvider options={{ clientId: paypalclientId }}>
      <div
        className="p-3 mt-3"
        style={{ backgroundColor: "white", borderRadius: "10px" }}
      >
        <h2>Order Details</h2>
        <div style={{ textAlign: "center" }}>
          {activeOrder.order_details.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
          {activeOrder.order_month && (
            <div>
              {new Date(activeOrder.order_month).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </div>
          )}
        </div>

        <div>
          <p>
            <strong>Order ID:</strong> {activeOrder.id}
          </p>
          <p>
            <strong>User ID:</strong> {activeOrder.user_id}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {activeOrder.status.charAt(0).toUpperCase() +
              activeOrder.status.slice(1)}
          </p>
        </div>

        <h3>Order Items</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {orderItems && orderItems.length > 0 ? (
              orderItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_description}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No items found for this order.</td>
              </tr>
            )}
          </tbody>
        </Table>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <p>
            <strong>Total Price:</strong> ${activeOrder.total_price}
          </p>
        </div>

        {activeOrder.status === "pending" && (
          <PayNowButton onGetOrder={getOrder} onPaid={doPaid} />
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default BreezoPayNow;
