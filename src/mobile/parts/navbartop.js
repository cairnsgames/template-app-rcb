import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import FavIcon from "../svg/favicon";
import BreezoCart from "../../packages/breezo/breezocart";
import BreezoOrders from "../../packages/breezo/breezoorders";
import FaceDropdown from "../components/facedropdown/facedropdown";
import PartnerBar from "../pages/partners/partnerbar";
import { useUser } from "../../packages/auth/context/useuser";

const NavBarTop = () => {
    
  const { hasAccess } = useUser();
  return (
    <header className="navbar-top">
      <Navbar className="px-3" bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">
            <FavIcon className="me-3" size={32} color={"white"} lineWidth="3" />{" "}
            Juzt Dance
          </Navbar.Brand>
          <Nav className="ms-auto  align-items-center">
            <Nav.Item>
              <BreezoOrders />
            </Nav.Item>
            <Nav.Item>
              <BreezoCart />
            </Nav.Item>
            <FaceDropdown />
          </Nav>
        </Container>
      </Navbar>
      {hasAccess("Partner") && <PartnerBar />}
    </header>
  );
};

export default NavBarTop;
