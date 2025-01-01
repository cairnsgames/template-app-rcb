import { useContext } from "react";
import { SettingsContext } from "./settingsprovider

const useSettings = () => {
  const context = useContext(SettingsContext);

  return context;
}

export default useSettings;