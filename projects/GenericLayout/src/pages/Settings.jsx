import React from "react";
import { Container, Form, Card, Row, Col, Button } from "react-bootstrap";
import Header from "../components/Header";
import useIsMobile from "../hooks/useIsMobile";
import MobileLayout from "../layouts/MobileLayout";
import DesktopLayout from "../layouts/DesktopLayout";

const Settings = () => {
  const isMobile = useIsMobile();
  const Layout = isMobile ? MobileLayout : DesktopLayout;

  return (
    <Layout>
      <Container fluid>
        <h1 className="mb-4">Settings</h1>
        <Row>
          <Col xs={12} lg={6}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Account Settings</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Language</Form.Label>
                    <Form.Select defaultValue="en">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Time Zone</Form.Label>
                    <Form.Select defaultValue="UTC">
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                    </Form.Select>
                  </Form.Group>

                  <Button variant="primary">Save Changes</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} lg={6}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Notifications</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="email-notifications"
                      label="Email Notifications"
                      defaultChecked
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="push-notifications"
                      label="Push Notifications"
                      defaultChecked
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="marketing-emails"
                      label="Marketing Emails"
                    />
                  </Form.Group>
                  <Button variant="primary">Save Changes</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Settings;
