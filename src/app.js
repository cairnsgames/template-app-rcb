import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Container } from "react-bootstrap";
import Providers from "./providers/providers";
import Routing from "./routing";
import { ErrorBoundary } from "react-error-boundary";
import SiteDown from "./sitedown";
import Toasts from "@cairnsgames/toasts/toasts";
import "./app.scss";

const App = () => {
  return (
    <ErrorBoundary fallback={<SiteDown />}>
      <Providers>
        <Container fluid style={{overflowY: "auto", padding: "0px"}}>
          <Routing />
        </Container>
        <Toasts />
      </Providers>
    </ErrorBoundary>
  );
};
const rootElement = document.getElementById("app");
const root = createRoot(rootElement);

root.render(<App />);
