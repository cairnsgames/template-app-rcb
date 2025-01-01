import React, { useState } from 'react';
import { Container, Row, Col, Card, Tab, Nav } from 'react-bootstrap';
import Header from './Header';
import UserDetailsTab from '../pages/profile/UserDetailsTab';
import SubscriptionTab from '../pages/profile/SubscriptionTab';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('user-details');

  return (
    <>
      <Header />
        <Row className="justify-content-center">
          <Col>
            <Card>
              <Card.Body>
                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                  <Nav variant="tabs" className="mb-4">
                    <Nav.Item>
                      <Nav.Link eventKey="user-details">User Details</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="subscription">Subscription Management</Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    <Tab.Pane eventKey="user-details">
                      <UserDetailsTab />
                    </Tab.Pane>
                    <Tab.Pane eventKey="subscription">
                      <SubscriptionTab />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
    </>
  );
};

export default Profile;
