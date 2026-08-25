import { useContext } from "react";
import { MobileDeviceContext } from "./mobiledeviceprovider";

export const useDeviceInfo = () => {
  const context = useContext(MobileDeviceContext);
  if (!context) {
    throw new Error("useDeviceInfo was used outside of its Provider");
  }
  const { deviceInfo, deviceIdentifier } = context;

  const isAndroid = deviceInfo?.platform === "android";
  const isWindows = (deviceInfo?.platform as string) === "windows";
  const deviceId = deviceIdentifier?.identifier;

  return { deviceInfo, deviceId, isAndroid, isWindows };
};

export default useDeviceInfo;
