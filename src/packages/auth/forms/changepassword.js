import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { useAuth } from "../../auth/context/useauth";
import { useUser } from "../../auth/context/useuser";
import { useTranslation } from 'react-i18next';

function ChangePasswordForm(props) {
  const { t } = useTranslation();
  const [validated, setValidated] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { user } = useUser();
  const id = user?.id || props.id || null;

  const { changePassword } = useAuth();

  // Support extracting code from both query string and hash fragment
  let code = null;
  // Try to get code from query string
  const urlParams = new URLSearchParams(window.location.search);
  code = urlParams.get("code");
  // If not found, try to get code from hash fragment (e.g., #reset?code=...)
  if (!code && window.location.hash) {
    const hash = window.location.hash;
    const hashQueryIndex = hash.indexOf("?");
    if (hashQueryIndex !== -1) {
      const hashParams = new URLSearchParams(hash.substring(hashQueryIndex + 1));
      code = hashParams.get("code");
    }
  }


  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false || newPassword !== confirmPassword) {
      setValidated(false);
      setError("Passwords do not match.");
      return;
    }

    setValidated(true);

    try {
      console.log("Change Password", id, oldPassword, code, newPassword, confirmPassword)
      const response = await changePassword(id, oldPassword === "" ? code : oldPassword, newPassword, confirmPassword);
      console.log("Change Password Response", response);
      if (response && response.message === "Password changed.") {
        setSuccessMessage("Your password has been successfully updated.");
        setTimeout(() => {
          window.location.hash = "";
        }, 1000);
      } else {
        setError("Unable to update your password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while processing your request.");
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="my-3">
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {props.validateOldPassword && (
          <Form.Group>
            <Form.Label>{t('changePasswordForm.oldPasswordLabel')}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t('changePasswordForm.oldPasswordPlaceholder')}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              {t('changePasswordForm.oldPasswordValidation')}
            </Form.Control.Feedback>
          </Form.Group>
        )}
        <Form.Group>
          <Form.Label>{t('changePasswordForm.newPasswordLabel')}</Form.Label>
          <Form.Control
            type="password"
            placeholder={t('changePasswordForm.newPasswordPlaceholder')}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {t('changePasswordForm.newPasswordValidation')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>{t('changePasswordForm.confirmPasswordLabel')}</Form.Label>
          <Form.Control
            type="password"
            placeholder={t('changePasswordForm.confirmPasswordPlaceholder')}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {t('changePasswordForm.confirmPasswordValidation')}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Button type="submit">{t('changePasswordForm.submitButton')}</Button>
    </Form>
  );
}

export default ChangePasswordForm;