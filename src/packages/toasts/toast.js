import { useState, useEffect } from "react";
import { Toast } from "react-bootstrap";
import { JuztDance } from "../components/utils";
import { useToast } from "../context/usetoast";

let timer;

const Toasts = () => {
  const [show, setShow] = useState(false);
  const { toast, setToast, toastVariant, setToastVariant, clearToast } = useToast();

  useEffect(() => {
    if (toast) {
      setShow(true);
      timer = setTimeout(() => {
        setShow(false);
        setToast(undefined);
        setToastVariant("success");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [toast, setToast, setToastVariant]);

  const handleClose = () => {
    setShow(false);
    clearToast();
  };

  return (
    <>
      {show ? (
        <Toast
          style={{
            zIndex: "999999",
            position: "absolute",
            top: "50px",
            left: "50px",
            color: toastVariant !== "" && toastVariant !== "warning" ? "white" : "black",
            borderRadius: "16px 016px 0px 0px "
          }}
          position="top-end"
          onClose={handleClose}
          show={true}
          bg={toastVariant}
        >
          <Toast.Header style={{ borderRadius: "15px 15px 0px 0px" }}>
            <strong className="me-auto">
              <JuztDance />
            </strong>
            <small></small>
          </Toast.Header>
          <Toast.Body bg="primary">{toast}</Toast.Body>
        </Toast>
      ) : null}
    </>
  );
};

export default Toasts;
