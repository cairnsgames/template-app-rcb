import React from "react";
import QRCode from "../../qrcode/qrcode";

const EventQRCode = ({
  event,
  size = 256,
  allowCopyToClipboard = false,
  className = "",
}) => {
  if (!event || !event.id) return null;

  const link = `http://juzt.dance/#events/${event.id}`;

  return (
    <div style={{ maxHeight: "350px" }} className={`border my-2 event-qrcode ${className}`}>
      <h3>QR Code</h3>
      <QRCode
        link={link}
        size={size}
        allowCopyToClipboard={allowCopyToClipboard}
      />
      <div>
        Share this QR Code to let others quickly access the event details.
      </div>
    </div>
  );
};

export default EventQRCode;
