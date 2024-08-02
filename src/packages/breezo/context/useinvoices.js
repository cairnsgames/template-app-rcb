import { useContext } from "react";
import { BreezoContext } from "./breezoprovider";

export const useInvoices = () => {
  // get the context
  const context = useContext(BreezoContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useInvoices was used outside of its Provider");
  }

  const { invoices, fetchInvoices, loading } = context;

  return { invoices, fetchInvoices, loading };
};

export default useInvoices;
