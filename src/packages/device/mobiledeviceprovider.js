import React, { createContext, useEffect, useState } from "react";
import { Device } from "@capacitor/device";

const MobileDeviceContext = createContext({});

const MobileDeviceProvider = (props) => {
  const { children } = props;

  const [deviceInfo, setDeviceInfo] = useState();
  const [deviceIdentifier, setDeviceIdentifier] = useState();

  useEffect(() => {
    Device.getInfo().then((info) => {
      console.log("#### Device Info",JSON.stringify(info));
      setDeviceInfo(info);
    });
    Device.getId().then((info) => {
        console.log("#### Device Id",JSON.stringify(info));
        setDeviceIdentifier(info);
      });
  }, []);

  return (
    <MobileDeviceContext.Provider value={{ deviceInfo, deviceIdentifier }}>
      {children}
    </MobileDeviceContext.Provider>
  );
};

export { MobileDeviceContext, MobileDeviceProvider };
