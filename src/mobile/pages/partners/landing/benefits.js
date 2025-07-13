import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { People, MusicNote, Building, Calendar, Cart } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

const PartnerBenefits = () => {
  const { t } = useTranslation();

  const partners = [
    { icon: People, title: t('landingPage.teachersTitle'), description: t('landingPage.teachersDescription') },
    { icon: MusicNote, title: t('landingPage.djsTitle'), description: t('landingPage.djsDescription') },
    { icon: Building, title: t('landingPage.venuesTitle'), description: t('landingPage.venuesDescription') },
    { icon: Calendar, title: t('landingPage.eventCoordinatorsTitle'), description: t('landingPage.eventCoordinatorsDescription') },
    { icon: Cart, title: t('landingPage.suppliersTitle'), description: t('landingPage.suppliersDescription') },
  ];

  return (
    <div>
      <h2 className="text-center pb-4">{t('landingPage.partnerBenefitsTitle')}</h2>
      <Row className="g-4">
        {partners.map((partner, index) => (
          <Col key={index} xs={12} md={6} lg={4}>
            <Card className="h-100 text-center">
              <Card.Body>
                <partner.icon size={48} className="mb-3" />
                <Card.Title>{partner.title}</Card.Title>
                <Card.Text>{partner.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PartnerBenefits;
