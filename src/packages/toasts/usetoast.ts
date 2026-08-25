import { useContext } from "react";
import { ToastsContext } from "./toastsprovider";

export const useToast = () => {
  const context = useContext(ToastsContext);
  if (!context) {
    throw new Error("useToast was used outside of its Provider");
  }
  return context;
};

export default useToast;
