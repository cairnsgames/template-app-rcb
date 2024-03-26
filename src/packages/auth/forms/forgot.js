import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

function ForgotPasswordForm({onSuccess}) {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (onSuccess) {
      onSuccess();
    }
    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <h3>Forgot Password</h3>
        <div className="m-3">
          Please enter your email address. If we find an account with your email address we will send you a link to use to change your password.
        </div>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              placeholder="name@domain.com"
              required
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