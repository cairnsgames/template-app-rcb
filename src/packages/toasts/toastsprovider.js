import { useState, createContext, useMemo  } from "react";

export const ToastsContext = createContext();

export const ToastsProvider = ({ children }) => {
  const [toast, setToast] = useState();
  const [toastVariant, setToastVariant] = useState("success");

  const values = useMemo(
    () => ({
      toast,
      setToast,
      toastVariant,
      setToastVariant,
    }),
    [toast, setToast, toastVariant, setToastVariant]
  );

  return (
    <ToastsContext.Provider value={values}>{children}</ToastsContext.Provider>
  );
};

export default ToastsProvider;
