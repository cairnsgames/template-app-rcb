import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import useUser from '../../mocks/providers/useuser';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ show, onHide, onShowRegister, onShowForgotPassword }) => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData.email, formData.password);
    onHide();
    navigate('/app');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Login
          </Button>
        </Form>
        
        <div className="text-center">
          <Button variant="link" onClick={onShowForgotPassword}>
            Forgot Password?
          </Button>
          <p className="mb-0">
            Don't have an account?{' '}
            <Button variant="link" className="p-0" onClick={onShowRegister}>
              Register
            </Button>
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
