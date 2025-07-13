import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useScrollTo from "../../../../hooks/usescrollto";

const Footer = () => {
  const { t } = useTranslation();
  const { scrollTo } = useScrollTo();

  return (
    <footer className="bg-dark text-white py-4">
      <Container className="text-center">
        <Row>
          <Col style={{ fontSize: "larger" }}>
            {t('landingPage.footerText')}
          </Col>
        </Row>
        <Row>
          <Col style={{ fontSize: "smaller" }}>
            {t('landingPage.footerCopyright')}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
