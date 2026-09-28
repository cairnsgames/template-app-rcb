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
    maxDifferencePercent: 5,
  },

  setup: "./setup.ts",

  screens: [
    // Logged-out screens — captured before the login step.
    { name: "landing", path: "/#landing", public: true, delay: 2000 },
    { name: "register", path: "/#register", public: true },
    { name: "reset", path: "/#reset", public: true },
    { name: "logout", path: "/#logout", public: true, delay: 5000 }, // discovered — review public/viewports
    { name: "referral", path: "/#referral", public: true }, // discovered — review public/viewports
    { name: "login", path: "/#login", public: true }, // discovered — review public/viewports

    // Logged-in screens — captured after setup.ts logs in.
    { name: "home", path: "/" },
    { name: "search", path: "/#search" },
    { name: "profile", path: "/#profile" },
    { name: "calendar", path: "/#calendar" },
    { name: "orders", path: "/#orders" },
    { name: "news", path: "/#news" }, // discovered — review public/viewports
    { name: "classes", path: "/#classes" }, // discovered — review public/viewports
    { name: "placeorder", path: "/#placeorder" }, // discovered — review public/viewports
    { name: "payorder-thankyou", path: "/#payorder/thankyou" }, // discovered — review public/viewports
    { name: "loyaltycarousel", path: "/#loyaltycarousel" }, // discovered — review public/viewports
    { name: "partner", path: "/#partner" }, // discovered — review public/viewports
    { name: "finances", path: "/#finances" }, // discovered — review public/viewports
    { name: "store", path: "/#store" }, // discovered — review public/viewports
    { name: "events", path: "/#events" }, // discovered — review public/viewports
    { name: "myevents", path: "/#myevents" }, // discovered — review public/viewports
    { name: "locations", path: "/#locations" }, // discovered — review public/viewports
    { name: "tickets", path: "/#tickets" }, // discovered — review public/viewports
    { name: "loyalty", path: "/#loyalty" }, // discovered — review public/viewports
    { name: "map", path: "/#map" }, // discovered — review public/viewports
    { name: "userloyalty", path: "/#userloyalty" }, // discovered — review public/viewports
    { name: "qrcode", path: "/#qrcode" }, // discovered — review public/viewports
    { name: "mycalendar", path: "/#mycalendar" }, // discovered — review public/viewports
  ],
};

export default screenConfig;
