import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import QRCode from "./qrcode";

type QRCodeSampleProps = {
  id?: string;
};

const QRCodeSample = ({ id }: QRCodeSampleProps) => {
  const [text, setText] = useState("This is an example");

  return (
    <>
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
          <Form.Text className="text-muted">
            Enter your own text to see the QR code change
          </Form.Text>
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
