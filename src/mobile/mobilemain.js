import React from "react";
import "./mobile.scss";
import Routing from "./routing";
import NavBarTop from "./parts/navbartop";
import NavBarbottom from "./parts/navbarbottom";
import useUser from "../packages/auth/context/useuser";

const MobileMain = () => {
  const mobile = /Mobi|Android/i.test(navigator.userAgent);
  const { user } = useUser();
  console.log("Mobile:", mobile);
  console.log("User:", user);

  const partner = user?.permissions.find((perm) => perm.name === "Partner");
  const isPartner = partner?.permission === "YES";  
  console.log("Is partner:", isPartner);

  return (
    <div className={`app-container ${mobile ? "mobile" : ""} ${user ? "logged-in" : "logged-out"}`}>
      <NavBarTop />
      <div className={`content-section ${isPartner ? "partner" : ""}`}>
        <Routing />
      </div>
      <NavBarbottom />
    </div>
  );
};

export default MobileMain;
