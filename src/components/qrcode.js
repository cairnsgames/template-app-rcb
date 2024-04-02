import { QRCode as QRCodeLogo } from "react-qrcode-logo";
import "./qrcode.scss";
import { Colors } from "../colors";

const QRCode = ({ link, allowCopyToClipboard = true }) => {
  console.log("!!!!!! COLORS", Colors);
  return (
    <div>
      <div className="qrcodecontainer">
        <QRCodeLogo
          size={250}
          value={`${link}&t=2`}
          fgColor={Colors.primary}
          ecLevel="H"
          logoImage="favicon.png"
          removeQrCodeBehindLogo={true}
          logoPadding={16}
          logoWidth={72}
          logoPaddingStyle="circle" // square
          qrStyle="dots"
          className="qrcode"
        />
      </div>
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
