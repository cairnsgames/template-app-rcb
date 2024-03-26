import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { useAuth } from "../../auth/context/useauth";

// interface ILoginProps {
//   onLogin?: (result: any) => void;
// }

const LoginForm = ({onSuccess}) => {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(false);

  const { login } = useAuth();

  const handleSubmit = (event) => {
    console.log("Handling submit", email, password)
    const form = event.currentTarget;
    
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      console.log("Not all values are entered correctly")
      return;
    }

    console.log("Call Login function");
    const result = login(email, password)
    // .then((result: any) => {
      console.log("Logged in successfully", result);
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
              type="email"
              placeholder="name@domain.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Form.Control.Feedback type="invalid">
              Your email address is required to login.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Form.Control.Feedback type="invalid">
              Please enter your password.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Check
          label="Keep me logged in"
          checked={keep}
          onChange={()=>{setKeep(!keep)}}
        />
      </Form.Group>
      <Button type="submit">Submit form</Button>
    </Form>
  );
}

export default LoginForm;