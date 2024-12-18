import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useAuth } from "../../auth/context/useauth";
import { useToast } from "../../toasts/usetoast";

function MagicLinkForm({ onSuccess }) {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const { requestMagicLink } = useAuth();
  const { addToast } = useToast();

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
          <p>You need to be a registered user to get a Magic Link</p>
          Please enter your email address. If we find an account with your email
          address we will send you a link that you can use to login
          automatically (valid for 7 days).
        </div>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <InputGroup hasValidation>
            <Form.Control type="text" placeholder="name@domain.com" required 
            value={email} onChange={(e) => setEmail(e.target.value)} />
            <Form.Control.Feedback type="invalid">
              Your email address is required to get a Magic Link.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Button onClick={handleSubmit}>Submit</Button>
    </Form>
  );
}

export default MagicLinkForm;
