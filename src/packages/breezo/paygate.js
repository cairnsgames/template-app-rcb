// /src/components/PayNowButton.js

import React, { useEffect } from "react";
import PayGateButton from "./paygatebutton";

const PayGate = ({ onGetOrder, onPaid }) => {
  if (!onGetOrder) {
    throw new Error("onGetOrder is required.");
  }
  if (!onPaid) {
    throw new Error("onPaid is required.");
  }

  console.log("==== PAYGATE Button")

  const createOrder = async (data, actions) => {
    console.log("==== PAYGATE Button createOrder", data, actions)
    try {
      // Send request to your PHP backend to create the PAYGATE order
      const order = await onGetOrder();
      const orderId = order.id;
      const totalPrice = order.total_price;
      const response = await fetch(
        "http://localhost/cairnsgames/php/paypal/create.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            order_id: orderId,
            total_price: totalPrice,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      console.log("==== PAYGATE Button response", response)

      const { eccode, paymentid, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      return eccode; // Return the eccode to the PAYGATE Buttons component
    } catch (error) {
      console.error("Error creating PAYGATE order:", error);
      // Handle error state in your component if needed
      return Promise.reject(error); // Ensure the PAYGATE Buttons handle the error properly
    }
  };

  const onApprove = async (data, actions) => {
    try {
      console.log("==== PAYGATE Button onApprove", data, actions)
      // Handle the approval of the payment
      if (onPaid) {
        onPaid();
      }

      // You might want to update the app state or notify the user here
      // For example, redirect to a success page or display a confirmation message
    } catch (error) {
      console.error("Error handling PAYGATE approval:", error);
    }
  };

  return (
    <div>
      <PayGateButton
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(error) => {
          console.error("PAYGATE Button Error:", error);
          // Handle the error case, like displaying an error message
        }}
      />
    </div>
  );
};

export default PayGate;
