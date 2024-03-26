import { useContext } from "react";
import { SettingsContext } from "./settingsprovider";

export const useSettings = () => {
  // get the context
  const context = useContext(SettingsContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useSettings was used outside of its Provider");
  }
  const { settings } = context;

  const getUserProperty = (key, defaultValue) => {
    const setting = settings?.find((item) => {
      return item.keyname === key;
    });
    if (!setting) {
      return defaultValue ?? "0"
    }
    return setting?.val ?? defaultValue;
  };

  return { settings, getUserProperty };
};

export default useSettings;