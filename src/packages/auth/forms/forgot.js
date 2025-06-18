import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { useAuth } from '../../auth/context/useauth';

function ForgotPasswordForm({ onSuccess }) {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { forgot } = useAuth();

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      setValidated(false);
      return;
    }

    setValidated(true);

    try {
      const response = await forgot(email);
      if (response && response.message === "Change password link was sent.") {
        setSuccessMessage('A password reset link has been sent to your email.');
      } else {
        setError('Unable to send password reset link. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while processing your request.');
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <div className="m-3">
          Please enter your email address. If we find an account with your email address, we will send you a link to reset your password.
        </div>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="email"
              placeholder="name@domain.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Your email address is required to reset your password.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Button type="submit">Submit</Button>
    </Form>
  );
}

export default ForgotPasswordForm;