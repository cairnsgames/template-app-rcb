import React, { createContext, useState } from "react";
import { Toast, ToastsContextValue } from "./toasts.types";

export const ToastsContext = createContext<ToastsContextValue | undefined>(undefined);

type ToastsProviderProps = {
  children: React.ReactNode;
};

export const ToastsProvider = ({ children }: ToastsProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [counter, setCounter] = useState(0);

  const getNextId = () => {
    setCounter((c) => c + 1);
    return counter;
  };

  const closeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const scheduleClose = (id: number, delay = 5000) => {
    setTimeout(() => {
      closeToast(id);
    }, delay);
  };

  const addToast = (title: string, message: string, variant: string, showTime = false) => {
    const newToast: Toast = {
      id: getNextId(),
      title,
      message,
      variant,
      time: new Date(),
      showTime,
    };
    setToasts((prev) => [...prev, newToast]);
    scheduleClose(newToast.id);
  };

  return (
    <ToastsContext.Provider value={{ toasts, addToast, closeToast }}>
      {children}
    </ToastsContext.Provider>
  );
};
