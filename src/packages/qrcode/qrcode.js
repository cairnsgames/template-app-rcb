import { QRCode as QRCodeLogo } from "react-qrcode-logo";
import "./qrcode.scss";
import { Colors } from "../../styles/colors";
import { Copy } from "react-bootstrap-icons";

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
}) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  const fullLink = `${link}&t=${type}`;
  return (
    <div {...props} className={`qrcodecontainer ${className}`}>
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
              logoPaddingStyle="circle" // square
              // qrStyle="dots"
              className="qrcode"
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
