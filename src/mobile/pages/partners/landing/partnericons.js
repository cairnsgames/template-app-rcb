import { Container, Row, Col, Card } from "react-bootstrap";
import {
  CalendarFill,
  CartFill,
  CardImage,
  Receipt,
  BalloonHeartFill,
  InfoCircle,
} from "react-bootstrap-icons";

const PartnerIcons = () => {
  const features = [
    {
      icon: CalendarFill,
      title: "Access Your Calendar (for Classes)",
      description: "Manage your class schedule effortlessly using this calendar feature. It allows you to organize and track upcoming classes, helping you stay on top of your teaching plans.",
    },
    {
      icon: CartFill,
      title: "Your Store (Coming Soon)",
      description: "Set up and manage your own store for selling merchandise directly to your audience. This feature will enable you to offer products like apparel, accessories, and more, all in one convenient place.",
    },
    {
      icon: CardImage,
      title: "Loyalty System",
      description: "Build loyalty with your dancers by using the loyalty system. Manage and scan dancers' cards to add stamps, reward consistent participation, and foster a dedicated community around your classes.",
    },
    {
      icon: Receipt,
      title: "Order Management (Coming Soon)",
      description: "Keep track of your ticket sales and merchandise purchases in one place. This tool will streamline the process of managing orders, ensuring a smooth experience for you and your customers.",
    },
    {
      icon: BalloonHeartFill,
      title: "Event Management (Coming Soon)",
      description: "Organize and promote your events easily. This feature will help you create, manage, and share event details with your audience, boosting participation and engagement.",
    },
    {
      icon: InfoCircle,
      title: "News Management",
      description: "Keep your dancers informed by adding and updating news items about your classes, events, and special announcements. Stay connected with your community and share important updates seamlessly.",
    },
  ];

  return (
    <div className="py-5">
      <h2 className="text-center pb-4">The Partner Bar</h2>
      <Container>
        The partner bar is exclusively available to our Partners, providing access to a range of features that help you manage your classes, store, events, and more. Explore the tools below to make the most out of our partnership.
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} xs={12} md={6} lg={4}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <feature.icon size={48} className="mb-3 text-primary" />
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
