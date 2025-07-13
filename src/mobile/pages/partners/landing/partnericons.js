import { Container, Row, Col, Card } from "react-bootstrap";
import {
  Calendar,
  Cart,
  Receipt,
  Balloon,
  InfoCircle,
  Heart,
} from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

const PartnerIcons = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Heart,
      title: t("landingPage.loyaltySystemTitle"),
      description: t("landingPage.loyaltySystemDescription"),
      href: "#partner/loyalty",
    },
    {
      icon: InfoCircle,
      title: t("landingPage.newsManagementTitle"),
      description: t("landingPage.newsManagementDescription"),
    },
    {
      icon: Calendar,
      title: t("landingPage.accessYourCalendarTitle"),
      description: t("landingPage.accessYourCalendarDescription"),
    },
    {
      icon: Cart,
      title: t("landingPage.yourStoreTitle"),
      description: t("landingPage.yourStoreDescription"),
    },
    {
      icon: Receipt,
      title: t("landingPage.orderManagementTitle"),
      description: t("landingPage.orderManagementDescription"),
    },
    {
      icon: Balloon,
      title: t("landingPage.eventManagementTitle"),
      description: t("landingPage.eventManagementDescription"),
    },
  ];

  return (
    <div className="py-5">
      <h2 className="text-center pb-4">{t("partnerBar.title")}</h2>
      <Container>
        {t("partnerBar.description")}
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} xs={12} md={6} lg={4}>
              <Card className="h-100 text-center">
                <Card.Body>
                  {feature.href ? (
                    <a href={feature.href}>
                      <feature.icon size={48} className="mb-3 text-primary" />
                    </a>
                  ) : (
                    <feature.icon size={48} className="mb-3 text-primary" />
                  )}
                  <Card.Title>{feature.title}</Card.Title>
                  <Card.Text>{feature.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default PartnerIcons;
