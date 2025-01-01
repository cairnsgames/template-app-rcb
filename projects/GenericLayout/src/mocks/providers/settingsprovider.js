import React, { useState, createContext, useEffect, useMemo } from "react";

export const SettingsContext = createContext();

export const MockSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    // Simulating an API call by setting hardcoded settings
    const mockSettings = [
      { keyname: "Min", val: "75" },
      { keyname: "stamp_price", val: "2" },
      { keyname: "Max", val: "100" },
      { keyname: "OpenAI_API_Key", val: "exampleKey123" },
    ];
    setSettings(mockSettings);
  }, []);

  const getUserProperty = (keyname) => {
    const property = settings.find(setting => setting.keyname === keyname);
    return property ? property.val : undefined;
  };

  const values = useMemo(
    () => ({
      settings,
      getUserProperty,
    }),
    [settings]
  );

  return (
    <SettingsContext.Provider value={values}>
      {children}
    </SettingsContext.Provider>
  );
};

export default MockSettingsProvider;
