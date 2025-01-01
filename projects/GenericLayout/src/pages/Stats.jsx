import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  BarChartFill,
  ArrowUpCircleFill,
  ArrowDownCircleFill,
} from "react-bootstrap-icons";
import Header from "../components/Header";
import useIsMobile from "../hooks/useIsMobile";
import MobileLayout from "../layouts/MobileLayout";
import DesktopLayout from "../layouts/DesktopLayout";

const Stats = () => {
  const isMobile = useIsMobile();
  const Layout = isMobile ? MobileLayout : DesktopLayout;

  return (
    <Layout>
      <Container fluid>
        <h1 className="mb-4">Statistics</h1>
        <Row>
          <Col xs={12} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Total Users</h6>
                    <h3 className="mb-0">1,234</h3>
                  </div>
                  <BarChartFill size={24} className="text-primary" />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Growth Rate</h6>
                    <h3 className="mb-0">+15.3%</h3>
                  </div>
                  <ArrowUpCircleFill size={24} className="text-success" />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Bounce Rate</h6>
                    <h3 className="mb-0">-2.4%</h3>
                  </div>
                  <ArrowDownCircleFill size={24} className="text-danger" />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Stats;
