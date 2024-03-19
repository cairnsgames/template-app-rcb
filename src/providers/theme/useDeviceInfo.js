import { useContext } from "react";
import { MobileDeviceContext } from "./PushNotificationsprovider";

export const usePushNotifications = () => {
    // get the context
    const context = useContext(MobileDeviceContext);
  
    // if `undefined`, throw an error
    if (!context) {
      throw new Error("useDeviceInfo was used outside of its Provider");
    }
    const { deviceInfo } = context;

    const isAndroid = deviceInfo.platform === "android";
    const isWindows = deviceInfo.platform === "windows";
  
    return { deviceInfo, isAndroid, isWindows };
  };