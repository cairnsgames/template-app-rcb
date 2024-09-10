import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Calendar, CreditCard, ClipboardCheck, BoxArrowInRight, Gear } from "react-bootstrap-icons";

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Class & Event Management",
      description: "Easily manage classes and events with robust scheduling and booking features.",
    },
    {
      icon: CreditCard,
      title: "Integrated Payments",
      description: "Accept payments directly through our platform with automatic invoicing and reporting.",
    },
    {
      icon: ClipboardCheck,
      title: "Order Tracking",
      description: "Keep track of all orders and sales with real-time updates and detailed reports.",
    },
    {
      icon: BoxArrowInRight,
      title: "Seamless Onboarding",
      description: "Get started quickly with a simple and intuitive onboarding process.",
    },
  ];

  return (
    <div className="py-5">
      <h2 className="text-center pb-4">Platform Features</h2>
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
    </div>
  );
};

export default Features;
