import React from "react";
import { createRoot } from "react-dom/client";
import Kloko from "./kloko";

function klokoMain(selector, appId, eventId, style) {
  console.log("klokoMain", selector, appId, eventId, style);

  const container = document.querySelector(selector);
  if (!container) {
    console.error(`Element with selector "${selector}" not found.`);
    return;
  }

  const root = createRoot(container);
  root.render(
    <Kloko appId={appId} eventId={eventId} style={style} />
  );
}

window.injectContent = klokoMain;
window.kloko = klokoMain;
export default klokoMain;
