import React, { useState } from "react";
import { CloseButton, Modal, Button, Carousel } from "react-bootstrap";
import LoginForm from "../../packages/auth/forms/login";
import RegisterForm from "../../packages/auth/forms/register";
import ForgotPasswordForm from "../../packages/auth/forms/forgot";
import MagicLinkForm from "../../packages/auth/forms/magiclink";

const MobileAuth = (props) => {
  const [mode, setMode] = useState(props.mode);
  return (
    <Modal show={true} style={{ top: "15%" }} onHide={props.onClose}>
      <Modal.Header>
        <Modal.Title>
          {mode === "register" && "Register an Account"}
          {mode === "forgot" && "Forgot Password"}
          {mode === "magiclink" && "Magic Link"}
          {mode === "login" && "Mobile Login"}
        </Modal.Title>
        {props.onClose && <CloseButton onClick={props.onClose} />}
      </Modal.Header>
      <Modal.Body>
        {mode === "register" && <RegisterForm {...props} />}
        {mode === "forgot" && <ForgotPasswordForm {...props} />}
        {mode === "magiclink" && <MagicLinkForm {...props} />}
        {mode === "login" && <LoginForm {...props} rememberMe={true} />}
      </Modal.Body>
      <Modal.Footer>
        {mode !== "register" && (
          <Button
            variant="outline-primary"
            onClick={() => {
              setMode("register");
            }}
          >
            Register
          </Button>
        )}
        {mode !== "login" && (
          <Button
            variant="outline-primary"
            onClick={() => {
              setMode("login");
            }}
          >
            Login
          </Button>
        )}
        {mode !== "magiclink" && (
          <Button
            variant="outline-primary"
            onClick={() => {
              setMode("magiclink");
            }}
          >
            Magic Link
          </Button>
        )}
        {mode !== "forgot" && (
          <Button
            variant="outline-primary"
            onClick={() => {
              setMode("forgot");
            }}
          >
            Forgot Password
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default MobileAuth;
