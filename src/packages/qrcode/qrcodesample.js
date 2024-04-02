import PageWrapper from "../../parts/pagewrapper";
import useGeoLocation from "../../hooks/usegeolocation";

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import QRCode from "./qrcode";

const QRCodeSample = ({ id }) => {
  const [text, setText] = useState("This is an example");
  return (<>
        <Form>
        <Form.Group className="mb-3">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mb-1"
          />
          <Form.Text className="text-muted">Enter your own text to see the QR code change</Form.Text>
        </Form.Group>
        </Form>
        <div style={{ padding: "1rem" }}>
          Your QR Code is:
          <div>
            <QRCode link={text} />
          </div>
        </div>
    </>
  );
};

export default QRCodeSample;
