import React, { createContext, useEffect, useState } from "react";
import { Device } from "@capacitor/device";
import { MobileDeviceContextValue } from "./device.types";

export const MobileDeviceContext = createContext<MobileDeviceContextValue | undefined>(undefined);

type MobileDeviceProviderProps = {
  children: React.ReactNode;
};

export const MobileDeviceProvider = ({ children }: MobileDeviceProviderProps) => {
  const [deviceInfo, setDeviceInfo] = useState<MobileDeviceContextValue["deviceInfo"]>(undefined);
  const [deviceIdentifier, setDeviceIdentifier] = useState<MobileDeviceContextValue["deviceIdentifier"]>(undefined);

  useEffect(() => {
    Device.getInfo().then((info) => {
      console.log("#### Device Info", JSON.stringify(info));
      setDeviceInfo(info);
    });
    Device.getId().then((info) => {
      console.log("#### Device Id", JSON.stringify(info));
      setDeviceIdentifier(info);
    });
  }, []);

  return (
    <MobileDeviceContext.Provider value={{ deviceInfo, deviceIdentifier }}>
      {children}
    </MobileDeviceContext.Provider>
  );
};
