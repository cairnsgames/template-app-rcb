import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import LoginModal from '../../components/auth/LoginModal';
import RegisterModal from '../../components/auth/RegisterModal';
import ForgotPasswordModal from '../../components/auth/ForgotPasswordModal';

const Hero = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleShowLogin = () => {
    setShowRegister(false);
    setShowForgotPassword(false);
    setShowLogin(true);
  };

  const handleShowRegister = () => {
    setShowLogin(false);
    setShowForgotPassword(false);
    setShowRegister(true);
  };

  const handleShowForgotPassword = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowForgotPassword(true);
  };

  return (
    <section className="hero d-flex align-items-center">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <h1 className="display-3 fw-bold mb-4">Transform Your Workflow</h1>
            <p className="lead mb-4">Experience the next generation of productivity tools designed for modern teams.</p>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <Button variant="secondary" size="lg" className="text-white">Join Waiting List</Button>
              <Button variant="primary" size="lg" onClick={handleShowLogin}>Open App</Button>
            </div>
          </Col>
        </Row>
      </Container>

      <LoginModal 
        show={showLogin}
        onHide={() => setShowLogin(false)}
        onShowRegister={handleShowRegister}
        onShowForgotPassword={handleShowForgotPassword}
      />
      
      <RegisterModal
        show={showRegister}
        onHide={() => setShowRegister(false)}
        onShowLogin={handleShowLogin}
      />
      
      <ForgotPasswordModal
        show={showForgotPassword}
        onHide={() => setShowForgotPassword(false)}
        onShowLogin={handleShowLogin}
      />
    </section>
  );
};

export default Hero;
