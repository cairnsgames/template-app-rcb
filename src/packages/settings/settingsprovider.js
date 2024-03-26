import { useState, createContext, useEffect, useMemo } from "react";
import { useUser } from "../auth/context/useuser";
import useTenant from "../tenant/context/usetenant";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState([]);
  const { tenant } = useTenant();
  const { user } = useUser();

  if (!process.env.REACT_APP_SETTINGS_API) {
    throw new Error("SettingsProvider: REACT_APP_SETTINGS_API environment variable is required");
  }

  useEffect(() => {
    if (user?.id) {
      fetch(`${process.env.REACT_APP_SETTINGS_API}/mysettings/${user.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", APP_ID: tenant },
        })
        .then((res) => res.json())
        .then((res) => {
          console.log("!!Settings!!",res)
          setSettings(res);
        })
        .catch((err) => {
          setSettings([]);
        });
    }
  }, [user]);

  const values = useMemo(
    () => ({
      settings,
    }),
    [settings]
  );

  return (
    <SettingsContext.Provider value={values}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
