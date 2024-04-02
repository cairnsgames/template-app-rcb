import { useContext } from "react";
import { MobileDeviceContext } from "./mobiledeviceprovider";

export const useDeviceInfo = () => {
    // get the context
    const context = useContext(MobileDeviceContext);
  
    // if `undefined`, throw an error
    if (!context) {
      throw new Error("useDeviceInfo was used outside of its Provider");
    }
    const { deviceInfo, deviceIdentifier } = context;

    const isAndroid = deviceInfo?.platform === "android";
    const isWindows = deviceInfo?.platform === "windows";

    const deviceId = deviceIdentifier?.identifier;
  
    return { deviceInfo, deviceId, isAndroid, isWindows };
  };

  export default useDeviceInfo;