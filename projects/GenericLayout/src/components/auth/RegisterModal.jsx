import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const RegisterModal = ({ show, onHide, onShowLogin }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm password" />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Register
          </Button>
        </Form>
        
        <div className="text-center">
          <p className="mb-0">
            Already have an account?{' '}
            <Button variant="link" className="p-0" onClick={onShowLogin}>
              Login
            </Button>
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;
