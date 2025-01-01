import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSubscription, SUBSCRIPTION_TYPES } from '../../contexts/SubscriptionContext';
import useUser from '../../mocks/providers/useuser';

const Pricing = () => {
  const { subscription, changeSubscription } = useSubscription();
  const { user, isLoggedIn } = useUser();

  const plans = [
    {
      name: SUBSCRIPTION_TYPES.FREE,
      price: '$0',
      features: ['1 User', '2 Projects', 'Basic Analytics', 'Email Support'],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: SUBSCRIPTION_TYPES.BASIC,
      price: '$29',
      features: ['5 Users', '10 Projects', 'Advanced Analytics', 'Priority Support'],
      buttonText: 'Try Basic',
      popular: true
    },
    {
      name: SUBSCRIPTION_TYPES.PRO,
      price: '$99',
      features: ['Unlimited Users', 'Unlimited Projects', 'Custom Analytics', '24/7 Support'],
      buttonText: 'Try Pro',
      popular: false
    }
  ];

  const handleSubscriptionChange = (planName) => {
    if (isLoggedIn) {
      changeSubscription(planName);
    }
  };

  return (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5">Pricing</h2>
        <Row>
          {plans.map((plan, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className={`h-100 pricing-card ${plan.popular ? 'popular-plan' : ''}`}>
                <Card.Body className="text-center">
                  <Card.Title className="h3">{plan.name}</Card.Title>
                  <div className="display-4 my-4">{plan.price}</div>
                  <p className="text-muted">per month</p>
                  {plan.features.map((feature, i) => (
                    <p key={i} className="mb-2">{feature}</p>
                  ))}
                  <Button 
                    variant={plan.popular ? "primary" : "outline-primary"} 
                    className="mt-4 w-100"
                    onClick={() => handleSubscriptionChange(plan.name)}
                    disabled={!isLoggedIn || subscription.type === plan.name}
                  >
                    {subscription.type === plan.name ? 'Current Plan' : plan.buttonText}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Pricing;
