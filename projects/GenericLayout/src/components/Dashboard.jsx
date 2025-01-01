import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import useUser from '../contexts/UserContext';
import Header from './Header';

const Dashboard = () => {
  const { user } = useUser();

  return (
    <>
      <Header />
      <Container>
        <Row className="mb-4">
          <Col>
            <h1>Welcome, {user.name}!</h1>
          </Col>
        </Row>
        
        <Row>
          <Col md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Statistics</Card.Title>
                <Card.Text>
                  View your activity and performance metrics here.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Recent Activity</Card.Title>
                <Card.Text>
                  Check your recent actions and updates.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
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
      </Container>
    </>
  );
};

export default Dashboard;
