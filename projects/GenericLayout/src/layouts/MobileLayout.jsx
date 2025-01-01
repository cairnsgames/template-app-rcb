import React from "react";
import { Container, Nav, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { navigationItems } from "../config/navigation";
import Header from "../components/Header";

const MobileLayout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <Header />
      <Container className="mb-5 pb-5">{children}</Container>

      <Nav className="fixed-bottom bg-white border-top mobile-nav">
        <Container className="px-1">
          <Row className="w-100 py-2">
            {navigationItems.map(({ id, label, icon: Icon, path }) => (
              <Col key={id} className="text-center px-1">
                <Nav.Link
                  as={Link}
                  to={path}
                  className={`d-flex flex-column align-items-center ${
                    location.pathname === path ? "active" : ""
                  }`}
                >
                  <Icon size={18} />
                  <span className="mobile-nav-text">{label}</span>
                </Nav.Link>
              </Col>
            ))}
          </Row>
        </Container>
      </Nav>
    </>
  );
};

export default MobileLayout;
