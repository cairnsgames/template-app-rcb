import { useContext } from "react";
import { MobileDeviceContext } from "./mobiledeviceprovider";

export const usePushNotifications = () => {
  const context = useContext(MobileDeviceContext);
  if (!context) {
    throw new Error("usePushNotifications was used outside of its Provider");
  }
  const { registrationToken } = context;
  return { registrationToken };
};

export default usePushNotifications;
