import React from "react";
import "./mobile.scss";
import Routing from "./routing";
import NavBarTop from "./parts/navbartop";
import NavBarbottom from "./parts/navbarbottom";
import useUser from "../packages/auth/context/useuser";

const MobileMain = () => {
  const mobile = /Mobi|Android/i.test(navigator.userAgent);
  const { user } = useUser();

  return (
    <div className={`app-container ${mobile ? "mobile" : ""} ${user ? "logged-in" : "logged-out"}`}>
      <NavBarTop />
      <div className="content-section">
        <Routing />
      </div>
      <NavBarbottom />
    </div>
  );
};

export default MobileMain;
