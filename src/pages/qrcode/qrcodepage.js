import PageWrapper from "../../parts/pagewrapper";
import useGeoLocation from "../../hooks/usegeolocation";

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import QRCode from "../../components/qrcode";

const QRCodePage = ({ id }) => {
  const [text, setText] = useState("This is an example");
  return (
    <PageWrapper style={{ margin: "1rem" }}>
        <h1>QR Code</h1>
        <Form>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Form.Group>
        <Button>Update</Button>
        </Form>
        <div style={{ padding: "1rem", border: "2px solid green", borderRadius: "2rem" }}>
          Your QR Code is:
          <div>
            <QRCode link={text} />
          </div>
        </div>
    </PageWrapper>
  );
};

export default QRCodePage;
