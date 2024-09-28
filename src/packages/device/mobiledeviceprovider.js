import React, { createContext, useEffect, useState } from "react";

const MobileDeviceContext = createContext({});

const MobileDeviceProvider = (props) => {
  const { children } = props;

  const [registrationToken, setRegistrationToken] = useState();
  const [deviceInfo, setDeviceInfo] = useState({}); // Default to an empty object
  const [deviceIdentifier, setDeviceIdentifier] = useState();

  // Mock implementation to replace Capacitor Push Notifications
  const isPushNotificationsAvailable = true; // Assume notifications are always available for simplicity

  const registration = (token) => {
    setRegistrationToken(token?.value || "mock-token");
  };

  const registrationError = (err) => {
    console.error("#### Registration error: ", err?.error || "Unknown error");
    alert("Registration Error", err?.message || "Unknown error");
  };

  const pushNotificationReceived = (notification) => {
    alert(
      "Message Received",
      notification?.title || "No title",
      JSON.stringify(notification) || "No content"
    );
  };

  const pushNotificationActionPerformed = (notification) => {
    console.log("Action performed on notification: ", notification);
  };

  useEffect(() => {
    // Mock device information
    setDeviceInfo({
      model: "Web Device",
      osVersion: "1.0.0",
    });

    // Mock device identifier
    setDeviceIdentifier("mock-device-id");

  }, []);

  useEffect(() => {
    if (!isPushNotificationsAvailable) {
      return;
    }

    const setUpPushNotifications = () => {
      // Mock listener setup
      console.log("Mock: Setting up push notifications");

      // Simulate registration
      registration({ value: "mock-registration-token" });

      // Other mock listeners
      console.log("Mock: pushNotificationReceived and pushNotificationActionPerformed listeners set.");
    };

    setUpPushNotifications();

    return () => {
      console.log("Mock: Removing all listeners");
    };
  }, []);

  const getDeliveredNotifications = () => {
    // Mock implementation of getting delivered notifications
    console.log("#### Mock: delivered notifications", []);
  };

  return (
    <MobileDeviceContext.Provider
      value={{ registrationToken, deviceInfo, deviceIdentifier }}
    >
      {children}
    </MobileDeviceContext.Provider>
  );
};

export { MobileDeviceContext, MobileDeviceProvider };
