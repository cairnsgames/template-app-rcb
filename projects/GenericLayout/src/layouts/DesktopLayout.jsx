import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { navigationItems } from '../config/navigation';
import Header from '../components/Header';

const DesktopLayout = ({ children }) => {
  const location = useLocation();

  return (
    <>
    
    <Header />
    <div className="dashboard-layout">
      <Row className="g-0">
        <Col md={2} className="sidebar-wrapper">
          <Nav className="flex-column border-end sidebar">
            {navigationItems.map(({ id, label, icon: Icon, path }) => (
              <Nav.Link 
                key={id}
                as={Link}
                to={path}
                className={`px-4 py-3 d-flex align-items-center ${location.pathname === path ? 'active' : ''}`}
              >
                <Icon size={20} className="me-3" />
                {label}
              </Nav.Link>
            ))}
          </Nav>
        </Col>
        <Col md={10} className="main-content">
          <Container fluid className="py-4">
            {children}
          </Container>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default DesktopLayout;
