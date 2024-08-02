import { useContext } from "react";
import { BreezoContext } from "./breezoprovider";

export const useOrders = () => {
  // get the context
  const context = useContext(BreezoContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useOrders was used outside of its Provider");
  }

  const { orders, fetchOrders, loading, createOrderFromCart } = context;

  return { orders, fetchOrders, loading, createOrderFromCart };
};

export default useOrders;
