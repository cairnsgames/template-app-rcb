import { useContext } from "react";
import { BreezoContext } from "./breezoprovider";

export const useCart = () => {
  // get the context
  const context = useContext(BreezoContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useCart was used outside of its Provider");
  }

  const { carts, cartItems, fetchCarts, loading, deleteItem } = context;

  return { carts, cartItems, fetchCarts, loading, deleteItem };
};

export default useCart;
