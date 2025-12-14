import React, { useState } from "react";
import {
  Form,
  Button,
  InputGroup,
  Row,
  Col,
  Alert,
  Dropdown,
} from "react-bootstrap";
import { useAuth } from "../../auth/context/useauth";
import { Eye } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

function RegisterForm({ language, onSuccess }) {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [error, setError] = useState();

  const { register } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    // Clear any previous errors
    setError(null);

    // Client-side validation
    let validationErrors = [];
    
    if (!firstName.trim()) {
      validationErrors.push("First name is required.");
    }
    
    if (!lastName.trim()) {
      validationErrors.push("Last name is required.");
    }
    
    if (password !== confirm) {
      validationErrors.push("Passwords do not match.");
    }
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      setValidated(true);
      return;
    }

    if (form.checkValidity() === false) {
      console.log("Form is invalid, please check the fields and try again.");
      setValidated(true);
      return;
    }

    register(email, password, confirm, firstName, lastName, language)
      .then((result) => {
        // Handle errors returned as an array of objects with 'message' property
        if (Array.isArray(result) && result.length > 0 && result[0].message) {
          // Combine all error messages
          const errorMessages = result.map(err => err.message).join(' ');
          setError(errorMessages);
          return;
        }
        // Handle errors in result.errors format
        if (result.errors) {
          if (Array.isArray(result.errors) && result.errors[0]?.message) {
            const errorMessages = result.errors.map(err => err.message).join(' ');
            setError(errorMessages);
          } else {
            setError(result.errors);
          }
          return;
        }
        if (result && onSuccess) {
          onSuccess(true);
        }
      })
      .catch((error) => {
        setError(error?.message || error?.toString() || 'An error occurred during registration');
        return;
      });
    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger">
          {t("registerForm.error")}: {error}
        </Alert>
      )}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>{t("registerForm.firstNameLabel")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("registerForm.firstNamePlaceholder")}
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
              isInvalid={validated && !firstName.trim()}
            />
            <Form.Control.Feedback type="invalid">
              {t("registerForm.firstNameValidation")}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>{t("registerForm.lastNameLabel")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("registerForm.lastNamePlaceholder")}
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
              isInvalid={validated && !lastName.trim()}
            />
            <Form.Control.Feedback type="invalid">
              {t("registerForm.lastNameValidation")}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Text className="text-muted">
            {t("registerForm.nameHelp")}
          </Form.Text>
        </Col>
      </Row>
      <Row className="mb-3">
        <Form.Group>
          <Form.Label>{t("registerForm.emailLabel")}</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="email"
              placeholder={t("registerForm.emailPlaceholder")}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Form.Control.Feedback type="invalid">
              {t("registerForm.emailValidation")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>{t("registerForm.passwordLabel")}</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type={seePassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              isInvalid={validated && password !== confirm}
            />
            <Button onClick={() => setSeePassword(!seePassword)}>
              <Eye />
            </Button>
            <Form.Control.Feedback type="invalid">
              {t("registerForm.passwordValidation")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>{t("registerForm.confirmPasswordLabel")}</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type={seePassword ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="confirm-password"
              isInvalid={validated && password !== confirm}
            />
            <Form.Control.Feedback type="invalid">
              {t("registerForm.confirmPasswordValidation")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Button type="submit">{t("registerForm.submitButton")}</Button>
    </Form>
  );
}

export default RegisterForm;
