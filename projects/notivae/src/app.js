import React from "react";
import ReactDOM from "react-dom/client";
import "./app.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";
import { FileSystemProvider } from "./context/FileSystemContext";

const App = () => (
  <FileSystemProvider>
    <div className="homepage d-flex flex-column min-vh-100">
      <Header />
      <Body />
      <Footer />
    </div>
  </FileSystemProvider>
);

export default App;
