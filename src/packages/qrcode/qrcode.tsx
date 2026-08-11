import React from "react";
import { QRCode as QRCodeLogo } from "react-qrcode-logo";
import "./qrcode.scss";
import { Colors } from "../../styles/colors";
import { Copy } from "react-bootstrap-icons";

type QRCodeProps = React.HTMLAttributes<HTMLDivElement> & {
  link: string;
  allowCopyToClipboard?: boolean;
  size?: number;
  logoPadding?: number;
  logoWidth?: number;
  logoImage?: string;
  color?: string;
  type?: number;
  code?: boolean;
};

const QRCode = ({
  link,
  allowCopyToClipboard = false,
  size = 128,
  logoPadding = 4,
  logoWidth = 64,
  logoImage = "shoe.png",
  color = Colors.primary,
  className = "",
  type = 1,
  code = true,
  ...props
}: QRCodeProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const fullLink = `${link}&t=${type}`;

  return (
    <div {...props} className={`qrcodecontainer ${className} packagesQRCode`}>
      {code && (
        <div className="shake">
          <QRCodeLogo
            size={size}
            value={`${link}`}
            fgColor={color}
            ecLevel="H"
            logoImage={logoImage}
            removeQrCodeBehindLogo={true}
            logoPadding={logoPadding}
            logoWidth={logoWidth}
            logoPaddingStyle="circle"
            quietZone={2}
          />
        </div>
      )}
      {allowCopyToClipboard && (
        <>
          <p />
          <span onClick={() => copyToClipboard(`${fullLink}`)}>
            Your Referral link to share: <br />
            {`${fullLink}`} <Copy size={16} color={"purple"} />
          </span>
        </>
      )}
    </div>
  );
};

export default QRCode;
