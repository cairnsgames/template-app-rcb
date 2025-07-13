import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Calendar, CreditCard, ClipboardCheck, BoxArrowInRight, Gear } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Calendar,
      title: t('landingPage.classManagementTitle'),
      description: t('landingPage.classManagementDescription'),
    },
    {
      icon: CreditCard,
      title: t('landingPage.integratedPaymentsTitle'),
      description: t('landingPage.integratedPaymentsDescription'),
    },
    {
      icon: ClipboardCheck,
      title: t('landingPage.orderTrackingTitle'),
      description: t('landingPage.orderTrackingDescription'),
    },
    {
      icon: BoxArrowInRight,
      title: t('landingPage.easyCheckInTitle'),
      description: t('landingPage.easyCheckInDescription'),
    },
    {
      icon: Gear,
      title: t('landingPage.customizationTitle'),
      description: t('landingPage.customizationDescription'),
    },
  ];

  return (
    <div className="py-5">
      <h2 className="text-center pb-4">{t('landingPage.featuresTitle')}</h2>
      <Row className="g-4">
        {features.map((feature, index) => (
          <Col key={index} xs={12} md={6} lg={4}>
            <Card className="h-100 text-center">
              <Card.Body>
                <feature.icon size={48} className="mb-3" />
                <Card.Title>{feature.title}</Card.Title>
                <Card.Text>{feature.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Features;
