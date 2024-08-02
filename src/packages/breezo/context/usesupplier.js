import { useContext } from "react";
import { BreezoContext } from "./breezoprovider";

export const useSupplier = () => {
  // get the context
  const context = useContext(BreezoContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useSupplier was used outside of its Provider");
  }

  const { payments, commission, items, fetchPayments, fetchCommission, fetchItems, loading } = context;

  return { payments, commission, items, fetchPayments, fetchCommission, fetchItems, loading };
};

export default useSupplier;
