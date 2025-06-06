import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import useScrollTo from "../../../hooks/usescrollto";

const Footer = () => {
  const { scrollTo } = useScrollTo();

  return (
    <footer className="bg-dark text-white py-4">
      <Container className="text-center">
        <Row>
          <Col style={{fontSize: "larger"}}>
            Brought to you by <span className="juztdance">Juzt.Dance</span>
          </Col>
        </Row>
        <Row>
          <Col style={{fontSize: "smaller"}}>© 2025 Juzt.Dance</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
