import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import useUser from '../../../mocks/providers/useuser';

const Dashboard = () => {
  const { user } = useUser();

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h1>Welcome, {user.name}!</h1>
        </Col>
      </Row>
      
      <Row>
        <Col xs={12} md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Statistics</Card.Title>
              <Card.Text>
                View your activity and performance metrics here.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Recent Activity</Card.Title>
              <Card.Text>
                Check your recent actions and updates.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <Card.Text>
                Access frequently used features here.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
