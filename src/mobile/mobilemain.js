import React from "react";
import "./mobile.scss";
import Routing from "./routing";
import NavBarTop from "./parts/navbartop";
import NavBarbottom from "./parts/navbarbottom";

const MobileMain = () => {
  const mobile = /Mobi|Android/i.test(navigator.userAgent);

  return (
    <div className={`app-container ${mobile ? "mobile" : ""}`}>
      <NavBarTop />
      <div className="content-section">
        <Routing />
      </div>
      <NavBarbottom />
    </div>
  );
};

export default MobileMain;
