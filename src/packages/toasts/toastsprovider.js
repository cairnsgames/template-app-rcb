import React, { createContext, useEffect, useState } from "react";

const ToastsContext = createContext();

const ToastsProvider = (props) => {
  const { children } = props;

  const [toasts, setToasts] = useState([]);
  const [counter, setCounter] = useState(0);

  const getNextId = () => {
    setCounter(counter + 1);
    return counter;
  };

  const scheduleClose = (id, delay = 5000) => {
    setTimeout(() => {
      closeToast(id);
    }, delay);
  }

  const addToast = (title, message, variant, showTime = false) => {
    const newToast = {
      id: getNextId(),
      title,
      message,
      variant,
      time: new Date(),
      showTime: showTime
    };
    const newToasts = [...toasts, newToast]
    setToasts(newToasts);
    scheduleClose(newToast.id);
  };

  const closeToast = (id) => {
    // must use arrow function in setter as this is called from a setTimeout
    setToasts(toasts => toasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastsContext.Provider value={{ toasts, addToast, closeToast }}>
      {children}
    </ToastsContext.Provider>
  );
};

export { ToastsContext, ToastsProvider };
