import { useContext } from "react";
import { AuthenticationContext } from "./toastsprovider";

export const useToast = () => {
  // get the context
  const context = useContext(AuthenticationContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useToast was used outside of its Provider");
  }

  const { toast, setToast, toastVariant, setToastVariant } = context;

  const createToast = (msg, variant) => {
		setToast(msg);
		setToastVariant(variant);
	}

  const clearToast = () => {
		setToast("");
		setToastVariant("success");
	}

  const successToast = (msg) => {
    setToast(msg);
    setToastVariant("");
  }

  const infoToast = (msg) => {
    setToast(msg);
    setToastVariant("info");
  }

  const warningToast = (msg) => {
    setToast(msg);
    setToastVariant("warning");
  }

  const dangerToast = (msg) => {
    setToast(msg);
    setToastVariant("danger");
  }
  const errorToast = dangerToast;

  return { toast, setToast, toastVariant, setToastVariant, createToast, clearToast, successToast, infoToast, warningToast, dangerToast, errorToast };
};
