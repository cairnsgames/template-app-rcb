import React from "react";
import { Container, ListGroup, Badge } from "react-bootstrap";
import Header from "../components/Header";
import useIsMobile from "../hooks/useIsMobile";
import MobileLayout from "../layouts/MobileLayout";
import DesktopLayout from "../layouts/DesktopLayout";

const Alerts = () => {
  const isMobile = useIsMobile();
  const Layout = isMobile ? MobileLayout : DesktopLayout;

  const alerts = [
    {
      id: 1,
      title: "System Update",
      message: "New features will be deployed tonight",
      type: "info",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "New Message",
      message: "You have a new message from the admin",
      type: "primary",
      time: "4 hours ago",
    },
    {
      id: 3,
      title: "Warning",
      message: "Your storage is almost full",
      type: "warning",
      time: "1 day ago",
    },
  ];

  return (
    <Layout>
      <Container fluid>
        <h1 className="mb-4">Alerts</h1>
        <ListGroup>
          {alerts.map((alert) => (
            <ListGroup.Item
              key={alert.id}
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">{alert.title}</div>
                {alert.message}
              </div>
              <div className="d-flex flex-column align-items-end">
                <Badge bg={alert.type} className="mb-1">
                  {alert.type}
                </Badge>
                <small className="text-muted">{alert.time}</small>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    </Layout>
  );
};

export default Alerts;
