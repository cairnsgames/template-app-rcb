import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "../../../src/providers/providers";
import { ErrorBoundary } from "react-error-boundary";
import SiteDown from "../../../src/sitedown";
import Toasts from "@cairnsgames/toasts/toasts";
import MobileApp from "../../../src/mobile/mobile";
import SSRProvider from 'react-bootstrap/SSRProvider';

import "./racingmanager.scss";

const App = () => (
  <ErrorBoundary fallback={<SiteDown />}>
  <SSRProvider> 
 <Providers>
 <MobileApp />
   {/* <Container fluid style={{overflowY: "auto", padding: "0px"}}>
     <Routing />
   </Container> */}
   <Toasts />
 </Providers>
 </SSRProvider>
</ErrorBoundary>
);
const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<App />)