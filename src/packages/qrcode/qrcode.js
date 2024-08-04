import { QRCode as QRCodeLogo } from "react-qrcode-logo";
import "./qrcode.scss";
import { Colors } from "../../colors";

const QRCode = ({
  link,
  allowCopyToClipboard = true,
  size = 255,
  logoPadding = 4,
  logoWidth = 64,
  logoImage = "favicon.png",
  color = Colors.primary,
  className = "",
  ...props
}) => {
  return (
    <div {...props} className={`qrcodecontainer ${className}`}>
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
        qrStyle="dots"
        className="qrcode"
        quietZone={2}
      />
      {allowCopyToClipboard && (
        <>
          {/* <p />
          <span onClick={() => copyToClipboard(`${link}&t=1`)}>
            Your Referral link to share: <br />
            {`${link}&t=1`}{" "}
            <CopyToClipboard width={16} height={16} color={"purple"} />
          </span> */}
        </>
      )}
    </div>
  );
};

export default QRCode;
