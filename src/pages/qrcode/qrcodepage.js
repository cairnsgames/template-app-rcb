import PageCentered from "../../parts/pagelayouts/pagecentered";
import useGeoLocation from "../../hooks/usegeolocation";

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import QRCode from "../../packages/qrcode/qrcode";
import QRCodeSample from "../../packages/qrcode/qrcodesample";

const QRCodePage = ({ id }) => {
  const [text, setText] = useState("This is an example");
  return (
    <PageCentered style={{ margin: "1rem" }}>
        <h1>QR Code</h1>
        <QRCodeSample />
    </PageCentered>
  );
};

export default QRCodePage;
