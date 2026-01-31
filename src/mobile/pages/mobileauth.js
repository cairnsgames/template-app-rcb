import React, { useState } from "react";
import { CloseButton, Modal, Button, Dropdown } from "react-bootstrap";
import LoginForm from "../../packages/auth/forms/login";
import RegisterForm from "../../packages/auth/forms/register";
import ForgotPasswordForm from "../../packages/auth/forms/forgot";
import MagicLinkForm from "../../packages/auth/forms/magiclink";
import { useEffect } from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import useUser from "../../packages/auth/context/useuser";


const MobileAuth = (props) => {
  const { t } = useTranslation();

  const [mode, setMode] = useState(props.mode);
  const [language, setLanguage] = useState("English");

  const { getIdFromFullId } = useUser();

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

  
      useEffect(() => {
        if (typeof window === "undefined") return;

        const searchParams = Object.fromEntries(new URLSearchParams(window.location.search));

        // parse hash params (e.g. "#referral?id=130021")
        const hashParams = (() => {
          const hash = window.location.hash || "";
          const withoutHash = hash.startsWith("#") ? hash.slice(1) : hash;
          const qIndex = withoutHash.indexOf("?");
          if (qIndex === -1) return {};
          const query = withoutHash.slice(qIndex + 1);
          return Object.fromEntries(new URLSearchParams(query));
        })();

        const params = { ...searchParams, ...hashParams };

        // treat juzt.dance fragment referrals specially
        const isJuztReferral =
          window.location.href.includes("juzt.dance") &&
          window.location.hash.startsWith("#referral");

          // normalize params.id using getIdFromFullId (ensure getIdFromFullId is imported / provided by useUser)
          if (params.id) {
            try {
              const normalizedId = getIdFromFullId(params.id);
              if (normalizedId !== undefined && normalizedId !== null) {
                params.id = normalizedId;
              }
            } catch (err) {
              console.error("getIdFromFullId failed:", err);
            }
          }


        const referVal = params.refer || params.id;
        if (!referVal) return;

        let payload = {};
        if (isJuztReferral) {
          // pad the refer value by adding three leading zeros (e.g. "130021" -> "000130021")
          const padded = referVal.toString().padStart(referVal.toString().length + 3, "0");
          // keep as string so padding is preserved
          payload.refer = padded;
        } else {
          const referNum = Number(referVal);
          payload.refer = Number.isNaN(referNum) ? referVal : referNum;
        }

        if ("t" in params) payload.t = params.t;

        const referBase =
          process.env.REACT_APP_REFERAL_API ||
          "http://cairnsgames.co.za/php/referals/";
        const referUrl = combineUrlAndPath(referBase, "refer.php");

        console.log("####### Registration Page: Sending referral data", payload);

        fetch(referUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch((err) => {
          console.error("Referral post failed", err);
        });
      }, []);

  return (
    <Modal show={true} style={{ top: "10%", maxHeight: "80vh" }} onHide={props.onClose}>
      <Modal.Header>
        <Modal.Title>
          {mode === "register" && t("mobileAuth.registerTitle")}
          {mode === "forgot" && t("mobileAuth.forgotTitle")}
          {mode === "magiclink" && t("mobileAuth.magicLinkTitle")}
          {mode === "login" && t("mobileAuth.loginTitle")}
        </Modal.Title>
        {props.onClose && <CloseButton onClick={props.onClose} />}
      </Modal.Header>
      <Modal.Body className="mobileAuth" style={{}}>
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
