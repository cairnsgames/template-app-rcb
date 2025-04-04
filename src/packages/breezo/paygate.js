// /src/components/PayNowButton.js

import React, { useEffect } from "react";
import PayGateButton from "./paygatebutton";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import useTenant from "../tenant/context/usetenant";
import useUser from "../auth/context/useuser.js";

const PayGate = ({ onGetOrder, onPaid }) => {
  if (!onGetOrder) {
    throw new Error("onGetOrder is required.");
  }
  if (!onPaid) {
    throw new Error("onPaid is required.");
  }

  const { tenant } = useTenant();
  const { user, token } = useUser();

  console.log("==== PAYGATE Button")

  const submitPayment = (payment_id, checksum) => {
    console.log("==== PAYGATE Button submitPayment", payment_id, checksum);
    const form = document.createElement("form");
    form.action = "https://secure.paygate.co.za/payweb3/process.trans";
    form.method = "POST";

    const input1 = document.createElement("input");
    input1.type = "hidden";
    input1.name = "PAY_REQUEST_ID";
    input1.value = payment_id;
    form.appendChild(input1);

    const input2 = document.createElement("input");
    input2.type = "hidden";
    input2.name = "CHECKSUM";
    input2.value = checksum;
    form.appendChild(input2);

    document.body.appendChild(form);
    form.submit();
  };

  const createOrder = async (data, actions) => {
    console.log("==== PAYGATE Button createOrder", data, actions)
    try {
      // Send request to your PHP backend to create the PAYGATE order
      const order = await onGetOrder();
      const orderId = order.id;
      const totalPrice = order.total_price;
      const response = await fetch(combineUrlAndPath(process.env.REACT_APP_PAYWEB3_API,"initiate.php?order_id=" + orderId),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "App_id": tenant,
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const result = await response.json();

      const { payment_id, checksum } = result;

      console.log("==== PAYGATE (PayWeb3) Button response", JSON.stringify(result))

      // Call this function after retrieving payment_id and checksum
      submitPayment(payment_id, checksum);

      return checksum; // Return the eccode to the PAYGATE Buttons component
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
