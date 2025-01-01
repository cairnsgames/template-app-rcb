import React from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useSubscription, SUBSCRIPTION_TYPES } from '../../contexts/SubscriptionContext';

const SubscriptionTab = () => {
  const { subscription, changeSubscription } = useSubscription();

  const plans = [
    {
      name: SUBSCRIPTION_TYPES.FREE,
      price: '$0',
      features: ['1 User', '2 Projects', 'Basic Analytics', 'Email Support'],
      buttonText: 'Switch to Free',
      popular: false
    },
    {
      name: SUBSCRIPTION_TYPES.BASIC,
      price: '$29',
      features: ['5 Users', '10 Projects', 'Advanced Analytics', 'Priority Support'],
      buttonText: 'Switch to Basic',
      popular: true
    },
    {
      name: SUBSCRIPTION_TYPES.PRO,
      price: '$99',
      features: ['Unlimited Users', 'Unlimited Projects', 'Custom Analytics', '24/7 Support'],
      buttonText: 'Switch to Pro',
      popular: false
    }
  ];

  return (
    <>
      <div className="mb-4">
        <h4>Current Subscription</h4>
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{subscription.type} Plan</h5>
              <Badge bg="primary">Active</Badge>
            </div>
            <div className="mb-3">
              <p className="mb-2"><strong>Features:</strong></p>
              <ul>
                <li>Max Users: {subscription.features.maxUsers}</li>
                <li>Max Projects: {subscription.features.maxProjects}</li>
                <li>Analytics Level: {subscription.features.analytics}</li>
                <li>Support Level: {subscription.features.support}</li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </div>

      <h4 className="mb-4">Available Plans</h4>
      <Row>
        {plans.map((plan, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card className={`h-100 ${plan.popular ? 'popular-plan' : ''}`}>
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
                  onClick={() => changeSubscription(plan.name)}
                  disabled={subscription.type === plan.name}
                >
                  {subscription.type === plan.name ? 'Current Plan' : plan.buttonText}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default SubscriptionTab;
