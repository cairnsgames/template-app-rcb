import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { useAuth } from "../../../auth/context/useauth";
import { Col } from 'react-bootstrap';

// interface ILoginProps {
//   onLogin?: (result: any) => void;
// }

const ApplicationForm = ({id, application, onSuccess}) => {
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState(application.name);
  const [description, setDescription] = useState(application.description);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      return;
    }

    const result = login(email, password)
    // .then((result: any) => {
      if (result && onSuccess) {
        onSuccess(true);
      }
    // });

    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="test"
              placeholder="application name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="application-name"
            />
            <Form.Control.Feedback type="invalid">
              Your email address is required to login.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="application-description"
            />
            <Form.Control.Feedback type="invalid">
              Please enter your password.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Button type="submit">Update</Button>
    </Form>
  );
}

export default ApplicationForm;