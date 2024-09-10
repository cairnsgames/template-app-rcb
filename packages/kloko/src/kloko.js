import React from "react";
import "./kloko.css"; // Import the CSS file
import { KlokoProvider } from "./klokocontext";
import KlokoEvent from "./klokoevent";
import KlokoButton from "./klokobutton";

const Kloko = ({ appId, eventId, style }) => {
  console.log("Kloko", appId, eventId, style);
  return (
    <KlokoProvider appId={appId} eventId={eventId}>
      {style === "button" ? <KlokoButton /> : <KlokoEvent />}
    </KlokoProvider>
  );
};
export default Kloko;
