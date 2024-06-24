import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useAuth } from "../../auth/context/useauth";
import { Eye, EyeSlash } from "react-bootstrap-icons";

import { GoogleLogin, googleLogout } from "@react-oauth/google";

// interface ILoginProps {
//   onLogin?: (result: any) => void;
// }

const LoginForm = ({ onSuccess, onClose }) => {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, setgoogleAccessToken } = useAuth();

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      console.log("Not all values are entered correctly");
      return;
    }

    const result = login(email, password);
    // .then((result: any) => {
    console.log("Logged in successfully", result);
    if (result && onSuccess) {
      onSuccess(true);
    }
    // });

    setValidated(true);
  };

  const responseMessage = (response) => {
    setgoogleAccessToken(response.credential);
    if (onClose) onClose();
  };

  const errorMessage = (error) => {
    console.error(error);
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
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button
              variant="outline-primary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlash /> : <Eye />}
            </Button>
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
          onChange={() => {
            setKeep(!keep);
          }}
        />
      </Form.Group>
      <Button type="submit">Submit form</Button>
      <GoogleLogin
        className="w-100"
        onSuccess={responseMessage}
        onError={errorMessage}
      />
    </Form>
  );
};

export default LoginForm;
