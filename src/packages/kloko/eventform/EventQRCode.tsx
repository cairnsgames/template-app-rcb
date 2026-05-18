import React, { useRef, useState } from "react";
import QRCode from "../../qrcode/qrcode";
import { Download, Clipboard, Whatsapp, Facebook } from "react-bootstrap-icons";
import { EventQRCodeProps } from "./EventQRCode.types";

const EventQRCode = ({
  event,
  size = 256,
  allowCopyToClipboard = false,
  allowDownload = false,
  allowWhatsapp = false,
  allowFacebook = false,
  className = "",
}: EventQRCodeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!event || !event.id) return null;

  const link = `http://juzt.dance/#events/${event.id}`;

  const getCanvas = (): HTMLCanvasElement | null =>
    containerRef.current?.querySelector("canvas") ?? null;

  const handleDownload = (): void => {
    const canvas = getCanvas();
    if (!canvas) return;
    const png = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = png;
    a.download = `event-${event.id}-qrcode.png`;
    a.click();
  };

  const handleCopyImage = async (): Promise<void> => {
    const canvas = getCanvas();
    if (!canvas) return;
    canvas.toBlob(async (blob: Blob | null) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  const handleWhatsapp = (): void => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(link)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleFacebook = (): void => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const iconStyle: React.CSSProperties = { cursor: "pointer", margin: "0 6px" };
  const hasActions =
    allowDownload || allowCopyToClipboard || allowWhatsapp || allowFacebook;

  return (
    <div
      style={{ maxHeight: "450px" }}
      className={`border my-2 event-qrcode ${className}`}
    >
      <h3>QR Code</h3>
      <div ref={containerRef} style={{ display: "inline-block" }}>
        <QRCode link={link} size={size} />
        {hasActions && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: "6px",
            }}
          >
            {allowDownload && (
              <Download
                size={24}
                style={iconStyle}
                title="Download QR Code"
                onClick={handleDownload}
              />
            )}
            {allowCopyToClipboard && (
              <Clipboard
                size={24}
                style={{ ...iconStyle, color: copied ? "green" : undefined }}
                title={copied ? "Copied!" : "Copy image to clipboard"}
                onClick={handleCopyImage}
              />
            )}
            {allowWhatsapp && (
              <Whatsapp
                size={24}
                style={{ ...iconStyle, color: "#25D366" }}
                title="Share on WhatsApp"
                onClick={handleWhatsapp}
              />
            )}
            {allowFacebook && (
              <Facebook
                size={24}
                style={{ ...iconStyle, color: "#1877F2" }}
                title="Share on Facebook"
                onClick={handleFacebook}
              />
            )}
          </div>
        )}
      </div>
      <div>Share this QR Code to let others quickly access the event details.</div>
    </div>
  );
};

export default EventQRCode;
