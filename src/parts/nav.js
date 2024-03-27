import React from "react";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useTheme } from "../providers/theme/usetheme";
import { useAuth } from "../packages/auth/context/useauth";
import DarkModeSwitch from "./darkmode";
import { useUser } from "../packages/auth/context/useuser";

function NavPart() {
  const { isLoggedIn, logout } = useAuth();
  const { hasAccess } = useUser();

  return (
    <Navbar
      bg="primary"
      data-bs-theme="dark"
      collapseOnSelect={true}
      expand="lg"
    >
      <Container>
        <Navbar.Brand href="#home">{process.env.brandname}</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="ms-2">
          <Nav className="me-auto">
            <NavDropdown className="bg-primary" title="System Pages">
              {hasAccess("Tenant") && (
                <Nav.Link className="bg-primary" href="#tenant" bg="primary">
                  Tenant Summary
                </Nav.Link>
              )}
              <Nav.Link className="bg-primary" href="#auth" bg="primary">
                Auth Summary
              </Nav.Link>

              <Nav.Link className="bg-primary" href="#flags" bg="primary">
                Flags Summary
              </Nav.Link>

              <Nav.Link className="bg-primary" href="#settings" bg="primary">
                Settings Summary
              </Nav.Link>
            </NavDropdown>

            {isLoggedIn && (
              <Nav.Link className="bg-primary" href="#events" bg="primary">
                Events
              </Nav.Link>
            )}
            {isLoggedIn && (
              <NavDropdown className="bg-primary" title="App Clones">
                <Nav.Link className="bg-primary" href="#insta" bg="primary">
                  InstaClone
                </Nav.Link>
                <Nav.Link className="bg-primary" href="#whatsapp" bg="primary">
                  Whatsapp
                </Nav.Link>
              </NavDropdown>
            )}
            {isLoggedIn && (
              <NavDropdown title="Design Elements">
                <NavDropdown.Item href="#design/accordian">
                  Accordian
                </NavDropdown.Item>
                <NavDropdown.Item href="#design/alert">Alerts</NavDropdown.Item>
                <NavDropdown.Item href="#design/badges">
                  Badges
                </NavDropdown.Item>
                <NavDropdown.Item href="#design/breadcrumbs">
                  Bread Crumbs
                </NavDropdown.Item>
                <NavDropdown.Item href="#design/buttongroup">
                  Button Group
                </NavDropdown.Item>
                <NavDropdown.Item href="#design/cards">Cards</NavDropdown.Item>
                <NavDropdown.Item href="#design/carousela">
                  Carousel
                </NavDropdown.Item>
                <NavDropdown.Item href="#design">
                  Other Elements
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          <Nav>
            <Nav.Item className="nav-link">
              <DarkModeSwitch />
            </Nav.Item>
            {isLoggedIn ? (
              <Nav.Link
                eventKey={1}
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link eventKey={2} href="#login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavPart;
