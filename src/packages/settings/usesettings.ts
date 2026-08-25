import { useContext } from "react";
import { SettingsContext } from "./settingsprovider";

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings was used outside of its Provider");
  }
  const { settings } = context;

  const getUserProperty = (key: string, defaultValue?: string): string => {
    const setting = settings?.find((item) => item.keyname === key);
    if (!setting) return defaultValue ?? "0";
    return setting.val ?? defaultValue ?? "0";
  };

  return { settings, getUserProperty };
};

export default useSettings;
