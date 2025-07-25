import React, { useState } from "react";
import { CloseButton, Modal, Button, Dropdown } from "react-bootstrap";
import LoginForm from "../../packages/auth/forms/login";
import RegisterForm from "../../packages/auth/forms/register";
import ForgotPasswordForm from "../../packages/auth/forms/forgot";
import MagicLinkForm from "../../packages/auth/forms/magiclink";
import { useEffect } from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

const MobileAuth = (props) => {
  const { t } = useTranslation();

  const [mode, setMode] = useState(props.mode);
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    switch (language) {
      case "English":
        i18n.changeLanguage("en");
        break;
      case "French":
        i18n.changeLanguage("fr");
        break;
      case "Spanish":
        i18n.changeLanguage("es");
        break;
      case "Portuguese":
        i18n.changeLanguage("pt");
        break;
      default:
        i18n.changeLanguage("en");
    }
  }, [language]);

  return (
    <Modal show={true} style={{ top: "15%" }} onHide={props.onClose}>
      <Modal.Header>
        <Modal.Title>
          {mode === "register" && t("mobileAuth.registerTitle")}
          {mode === "forgot" && t("mobileAuth.forgotTitle")}
          {mode === "magiclink" && t("mobileAuth.magicLinkTitle")}
          {mode === "login" && t("mobileAuth.loginTitle")}
        </Modal.Title>
        {props.onClose && <CloseButton onClick={props.onClose} />}
      </Modal.Header>
      <Modal.Body>
        {mode === "register" && <RegisterForm {...props} language={language} />}
        {mode === "forgot" && <ForgotPasswordForm {...props} language={language} />}
        {mode === "magiclink" && (
          <MagicLinkForm
            {...props} language={language}
            onSuccess={() => {
              setMode("login");
            }}
          />
        )}
        {mode === "login" && <LoginForm {...props} rememberMe={true} language={language} />}
      </Modal.Body>
      <Modal.Footer>
        <Dropdown className="float-start">
          <Dropdown.Toggle variant="secondary" id="language-dropdown">
            {language}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              active={language === "English"}
              onClick={() => setLanguage("English")}
            >
              English
            </Dropdown.Item>
            <Dropdown.Item
              active={language === "French"}
              onClick={() => setLanguage("French")}
            >
              French
            </Dropdown.Item>
            <Dropdown.Item
              active={language === "Portuguese"}
              onClick={() => setLanguage("Portuguese")}
            >
              Portuguese
            </Dropdown.Item>
            <Dropdown.Item
              active={language === "Spanish"}
              onClick={() => setLanguage("Spanish")}
            >
              Spanish
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
