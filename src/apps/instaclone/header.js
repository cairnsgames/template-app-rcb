import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Following from "./following";

function Header() {
  return (
    <div className="header">
        <Following title="Following" />
        <Following title="Nearby" size={48} style={{height: "75px"}}/>
    </div>
  );
}

export default Header;
