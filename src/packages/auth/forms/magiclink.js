import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useAuth } from "../../auth/context/useauth";
import { useToast } from "../../toasts/usetoast";
import { useTranslation } from 'react-i18next';

function MagicLinkForm({ onSuccess }) {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const { requestMagicLink } = useAuth();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    requestMagicLink(email).then((result) => {
      console.log("Magic Link sent to your email", result);
      addToast("Sent", "Magic Link sent to your email", { appearance: "success" });
      if (onSuccess) {
        onSuccess();
      }
    });
    setValidated(true);

    // call magic link in context
  };

  return (
    <Form noValidate validated={validated}>
      <Row className="mb-3">
        <div className="m-3">
          <p>{t('magicLinkForm.instructions')}</p>
          <Form.Group>
            <Form.Label>{t('magicLinkForm.emailLabel')}</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder={t('magicLinkForm.emailPlaceholder')}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {t('magicLinkForm.emailValidation')}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </div>
      </Row>
      <Button onClick={handleSubmit}>{t('magicLinkForm.submitButton')}</Button>
    </Form>
  );
}

export default MagicLinkForm;
