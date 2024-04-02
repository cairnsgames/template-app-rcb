import { useContext } from "react";
import { MobileDeviceContext } from "./mobiledeviceprovider";

export const usePushNotifications = () => {
    // get the context
    const context = useContext(MobileDeviceContext);
  
    // if `undefined`, throw an error
    if (!context) {
      throw new Error("usePushNotifications was used outside of its Provider");
    }
    const { registrationToken } = context;
  
    return { registrationToken };
  };

  export default usePushNotifications;