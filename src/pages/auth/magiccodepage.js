import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import useToast from "@cairnsgames/toasts/usetoast";
import useAuth from "../../packages/auth/context/useauth";

const MagicCodePage = (props) => {
  const { addToast } = useToast();
  const { loginWithMagicLink } = useAuth();

  useEffect(() => {
    if (props?.code.length) {
      loginWithMagicLink(props.code);
    }
  }, [props.code]);

  return (
    <PageCentered position="middle" >
      <Row className="border-bottom">
        <h1>MAGIC CODE</h1>
      </Row>
      <Row className="mt-3">
        <Col>Code</Col>
        <Col>{props.code}</Col>
      </Row>
    </PageCentered>
  );
};

export default MagicCodePage;
