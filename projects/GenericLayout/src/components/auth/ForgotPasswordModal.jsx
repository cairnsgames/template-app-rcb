import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ForgotPasswordModal = ({ show, onHide, onShowLogin }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Reset Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-4">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Send Reset Link
          </Button>
        </Form>
        
        <div className="text-center">
          <p className="mb-0">
            Remember your password?{' '}
            <Button variant="link" className="p-0" onClick={onShowLogin}>
              Login
            </Button>
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;
