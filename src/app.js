import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Container } from "react-bootstrap";
import "./app.scss";

import NavPart from "./parts/nav";

import Providers from "./providers/providers";
import Routing from "./routing";

const App = () => {

  return (
    <Providers>
      <Container fluid>
        <NavPart />
        <Routing />
      </Container>
    </Providers>
  );
};
const rootElement = document.getElementById("app");
const root = createRoot(rootElement);

root.render(<App />);
