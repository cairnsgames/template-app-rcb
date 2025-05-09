import React from "react";
import { Button, Container } from "react-bootstrap";
import useLocation from "./hooks/uselocation";

const SiteDown = ({ error }) => {
  const { param } = useLocation();
  return (
    <Container style={{ height: "80vh" }}>
      <div style={{ marginTop: "40vh" }} className="text-center mb-3">
        <h3>The website is currently unavailable</h3>
      </div>
      {param("error") && <div className="text-center">{param("error")}</div>}
      {param("reason") && <div className="text-center">{param("reason")}</div>}
      <div className="text-center mt-5">
        <Button
          onClick={() => {
            window.location.href = "#home";
            window.location.reload();
          }}
        >
          Reload
        </Button>
      </div>
      <div>
        <h5>Error message</h5>
        {error && <pre>{error.message}</pre>}
      </div>
    </Container>
  );
};

export default SiteDown;
