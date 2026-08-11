import { DeviceInfo, DeviceId } from "@capacitor/device";

export type MobileDeviceContextValue = {
  deviceInfo: DeviceInfo | undefined;
  deviceIdentifier: DeviceId | undefined;
  registrationToken?: string;
};
