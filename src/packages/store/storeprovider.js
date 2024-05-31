import { useState, createContext, useEffect, useMemo } from "react";
import { useUser } from "../auth/context/useuser";
import useTenant from "../tenant/context/usetenant";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [store, setStore] = useState([]);
  const { tenant } = useTenant();
  const { user } = useUser();

  if (!process.env.REACT_APP_STORE_API) {
    throw new Error("StoreProvider: REACT_APP_STORE_API environment variable is required");
  }

  useEffect(() => {
    if (user?.id) {
      fetch(`${process.env.REACT_APP_STORE_API}/store/${user.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", APP_ID: tenant },
        })
        .then((res) => res.json())
        .then((res) => {
          setStore(res);
        })
        .catch((err) => {
          setStore([]);
        });
    }
  }, [user]);

  const values = useMemo(
    () => ({
      store,
    }),
    [store]
  );

  return (
    <StoreContext.Provider value={values}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
