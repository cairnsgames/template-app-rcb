import React from 'react';
import { createRoot } from 'react-dom/client';
import Zharo from './zharo';

function zharoMain(selector, appId, eventId) {
  const container = document.querySelector(selector);
  if (!contentId) {
    contentId = itemtype;
    itemtype = "Zharo";
  }
  if (!container) {
    console.error(`Element with selector "${selector}" not found.`);
    return;
  }

  const root = createRoot(container);
  root.render(<Zharo appId={appId} eventId={eventId}/>);
}

window.injectContent = zharoMain;
window.zharo = zharoMain;
export default zharoMain;
