import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

function MagicLinkForm({onSuccess}) {
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
        <div className="m-3">
          <p>You need to be a registered user to get a Magic Link</p>
          Please enter your email address. If we find an account with your email address we will send you a link that you can use to login automatically (valid for 7 days).
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
              Your email address is required to get a Magic Link.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Button type="submit">Submit</Button>
    </Form>
  );
}

export default MagicLinkForm;