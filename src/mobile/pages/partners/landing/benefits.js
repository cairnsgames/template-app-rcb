import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { People, MusicNote, Building, Calendar, Cart } from "react-bootstrap-icons";

const PartnerBenefits = () => {
  const partners = [
    { icon: People, title: "Teachers", description: "Manage your classes and bookings seamlessly. We take 10% per booking." },
    { icon: MusicNote, title: "DJs", description: "Book gigs and sell your mixes directly on our site." },
    { icon: Building, title: "Venues", description: "Start a loyalty program and manage dancer engagements. R3 per stamp." },
    { icon: Calendar, title: "Event Coordinators", description: "Create and manage events with different ticket types. We take 10% per ticket." },
    { icon: Cart, title: "Suppliers", description: "Open a shop and sell merchandise directly. We take 10% per order." },
  ];

  return (
    <div>
      <h2 className="text-center pb-4">Partner Benefits</h2>
      <Row className="g-4">
        {partners.map((partner, index) => (
          <Col key={index} xs={12} md={6} lg={4}>
            <Card className="h-100 text-center">
              <Card.Body>
                <partner.icon size={48} className="mb-3 text-primary" />
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
