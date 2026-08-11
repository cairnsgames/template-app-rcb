import type { ScreenConfig } from "./types.ts";

export const screenConfig: ScreenConfig = {
  baseUrl: "http://localhost:3001",

  viewports: {
    phone: { width: 390, height: 844 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1440, height: 900 },
  },

  comparison: {
    pixelThreshold: 0.1,
    maxDifferencePercent: 0.5,
  },

  setup: "./setup.ts",

  screens: [
    // Logged-out screens — captured before the login step.
    { name: "landing", path: "/#landing", public: true },
    { name: "register", path: "/#register", public: true },
    { name: "reset", path: "/#reset", public: true },

    // Logged-in screens — captured after setup.ts logs in.
    { name: "home", path: "/" },
    { name: "search", path: "/#search" },
    { name: "profile", path: "/#profile" },
    { name: "calendar", path: "/#calendar" },
    { name: "orders", path: "/#orders" },
  ],
};

export default screenConfig;
