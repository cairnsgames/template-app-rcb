import React, { useState } from "react";
import { Form, Button, InputGroup, Row, Alert } from "react-bootstrap";
import { useAuth } from "../../auth/context/useauth";
import { Eye } from "react-bootstrap-icons";

function RegisterForm({ onSuccess }) {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [error, setError] = useState();

  const { register } = useAuth();
  // const { t } = useTranslation();
  const t = (key) => key;

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      console.log("Form is invalid, please check the fields and try again.");
      return;
    }

    register(email, password, confirm)
      .then((result) => {
        if (result.errors) {
          setError(result.errors[0].message);
          return;
        }
        if (result && onSuccess) {
          onSuccess(true);
        }
      })
      .catch((error) => {
        setError(error);
        return;
      });
    setValidated(true);
    // if (onSuccess) {
    //   onSuccess();
    // }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger">
          {t("Cannot register: ")}: {error}
        </Alert>
      )}
      <Row className="mb-3">
        <Form.Group>
          <Form.Label>Email address</Form.Label>
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
              Your email address is required.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type={seePassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button onClick={() => setSeePassword(!seePassword)}>
              <Eye />
            </Button>
            <Form.Control.Feedback type="invalid">
              Please enter a new, secure password.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type={seePassword ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="confirm-password"
            />
            <Form.Control.Feedback type="invalid">
              Please enter the same password as above.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Button type="submit">Register</Button>
    </Form>
  );
}

export default RegisterForm;
