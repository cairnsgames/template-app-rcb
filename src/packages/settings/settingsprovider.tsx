import { useState, createContext, useEffect, useMemo } from "react";
import { useUser } from "../auth/context/useuser";
import useTenant from "../tenant/context/usetenant";
import { logUntypedResponse } from "../../functions/loguntypedresponse";
import { Setting, SettingsContextValue } from "./settings.types";

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

type SettingsProviderProps = {
  children: React.ReactNode;
  user?: unknown;
  tenant?: unknown;
  token?: unknown;
};

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const { tenant } = useTenant();
  const { user } = useUser();

  if (!process.env.REACT_APP_SETTINGS_API) {
    throw new Error("SettingsProvider: REACT_APP_SETTINGS_API environment variable is required");
  }

  useEffect(() => {
    if (user?.id) {
      fetch(`${process.env.REACT_APP_SETTINGS_API}/mysettings/${user.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", APP_ID: tenant },
      })
        .then((res) => res.json())
        .then((res) => {
          setSettings(logUntypedResponse<Setting[]>("settingsprovider.mysettings", res));
        })
        .catch(() => {
          setSettings([]);
        });
    }
  }, [user]);

  const values = useMemo(() => ({ settings }), [settings]);

  return (
    <SettingsContext.Provider value={values}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
