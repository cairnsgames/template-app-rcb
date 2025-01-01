import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Lightning, Shield, BarChart, Clock } from 'react-bootstrap-icons';

const Features = () => {
  const features = [
    {
      icon: <Lightning className="feature-icon" />,
      title: 'Lightning Fast',
      description: 'Optimized performance for seamless operation'
    },
    {
      icon: <Shield className="feature-icon" />,
      title: 'Secure by Design',
      description: 'Enterprise-grade security for your peace of mind'
    },
    {
      icon: <BarChart className="feature-icon" />,
      title: 'Advanced Analytics',
      description: 'Deep insights into your business metrics'
    },
    {
      icon: <Clock className="feature-icon" />,
      title: 'Real-time Updates',
      description: 'Stay synchronized across all devices'
    }
  ];

  return (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-5">Features</h2>
        <Row>
          {features.map((feature, index) => (
            <Col md={3} key={index} className="text-center mb-4">
              {feature.icon}
              <h3 className="h5">{feature.title}</h3>
              <p>{feature.description}</p>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Features;
