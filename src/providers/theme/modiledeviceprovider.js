import React, { createContext, useEffect, useState } from "react";
import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Device } from "@capacitor/device";

const MobileDeviceContext = createContext({ PushNotifications: "" });

const MobileDeviceProvider = (props) => {
  const { children } = props;

  const [registrationToken, setRegistrationToken] = useState();
  const [deviceInfo, setDeviceInfo] = useState();

  useEffect(() => {
    // When token changes, make sure to store it on backend to allow sending of messages to the device in future. (Link token with userid for example)
    // Probably not here, so usePushNotifications and when UserId is chnaged do the save
  }, [registrationToken]);

  const isPushNotificationsAvailable =
    Capacitor.isPluginAvailable("PushNotifications");

  const registration = (token) => {
    setRegistrationToken(token.value);
    console.log("#### Registration", JSON.stringify(token));
  };
  const registrationError = (err) => {
    console.error("#### Registration error: ", err.error);
    alert("Registration Error", err.error.message || "Unknown error");
  };

  const pushNotificationReceived = (notification) => {
    console.log("#### Push notification received: ", notification);
    alert("Message Recieved", notification.title, JSON.stringify(notification));
    async (notification) => {
        let now = {
          notifications: [{
            id: Date.now(),
            body: notification.body,
            title: notification.title,
            ongoing: false,
          }]
        };
        const result = await LocalNotifications.schedule(now)
        console.log(result)
      }
  };

  const pushNotificationActionPerformed = (notification) => {
    console.log(
      "#### Push notification action performed",
      notification.actionId,
      notification.inputValue,
      JSON.stringify(notification)
    );
  };

  useEffect(() => {
    Device.getInfo().then((info) => {
      console.log("#### Device Infp",JSON.stringify(info));
    });
    Device.getId().then((info) => {
        console.log("#### Device Id",JSON.stringify(info));
      });    
  }, []);

  useEffect(() => {
    if (!isPushNotificationsAvailable) {
      return () => {};
    }
    const setUpPushNotifications = async () => {
      await PushNotifications.addListener("registration", registration);
      await PushNotifications.addListener(
        "registrationError",
        registrationError
      );
      await PushNotifications.addListener(
        "pushNotificationReceived",
        pushNotificationReceived
      );
      await PushNotifications.addListener(
        "pushNotificationActionPerformed",
        pushNotificationActionPerformed
      );

      const registerNotifications = async () => {
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === "prompt") {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== "granted") {
          throw new Error("User denied permissions!");
        }

        await PushNotifications.register();
      };

      await registerNotifications();
    };
    setUpPushNotifications();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, []);

  const getDeliveredNotifications = async () => {
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
    console.log("#### delivered notifications", notificationList);
  };

  return (
    <MobileDeviceContext.Provider value={{ registrationToken, deviceInfo }}>
      {children}
    </MobileDeviceContext.Provider>
  );
};

export { MobileDeviceContext, MobileDeviceProvider };
