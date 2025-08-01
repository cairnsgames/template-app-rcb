import React, { useState } from "react";
import { Form, Button, InputGroup, Row, Col, Alert, ButtonGroup } from "react-bootstrap";
import { useAuth } from "../../auth/context/useauth";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useTranslation } from 'react-i18next';

const LoginForm = ({ onSuccess, onClose, rememberMe }) => {
  const { t } = useTranslation();
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { login, setgoogleAccessToken } = useAuth();
  const [errors, setErrors] = useState();
  const [warning, setWarning] = useState();

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(false);
      return;
    }

    setValidated(true);

    login(email, password)
      .then((result) => {
        if (result.errors) {
          setErrors(result.errors[0].message);
          return;
        }
        if (result && onSuccess) {
          onSuccess(true);
        }
      })
      .catch((error) => {
        console.log("Cannot login", error);
        setErrors(error);
      });
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
      {errors && (
        <Alert variant="danger">
          {t("Cannot log in")}: {errors}
        </Alert>
      )}
      <Row className="mb-3">
        <Form.Group>
          <Form.Label>{t('loginForm.emailLabel')}</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="email"
              placeholder={t('loginForm.emailPlaceholder')}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Form.Control.Feedback type="invalid">
              {t("Your email address is required to login.")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>{t("Password")}</Form.Label>
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
              {t("Please enter your password.")}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      {!rememberMe && (
        <Form.Group className="mb-3">
          <Form.Check
            label={t('loginForm.keepMeLoggedIn')}
            checked={keep}
            onChange={() => {
              setKeep(!keep);
            }}
          />
        </Form.Group>
      )}
      <Row>
        <Col>
        <ButtonGroup>
          <Button type="submit">{t("Login")}</Button>
          {onClose && <Button variant="outline-primary" onClick={onClose}>{t("Close")}</Button>}
          </ButtonGroup>
        </Col>
        <Col>
          <GoogleLogin
            className="w-100"
            onSuccess={responseMessage}
            onError={errorMessage}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default LoginForm;
