import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useAuth } from "@cairnsgames/auth/context/useauth";
import { useUser } from "@cairnsgames/auth/context/useuser";
import DarkModeSwitch from "./darkmode";

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
            <NavDropdown className="bg-primary" title="Sample Pages">
              <Nav.Link className="bg-primary" href="#review" bg="primary">
                Reviews
              </Nav.Link>
              
              <Nav.Link className="bg-primary" href="#wizard" bg="primary">
                Wizard
              </Nav.Link>
              <Nav.Link className="bg-primary" href="#geolocation" bg="primary">
                Geo Location
              </Nav.Link>

              <Nav.Link className="bg-primary" href="#map" bg="primary">
                Map
              </Nav.Link>
              <Nav.Link className="bg-primary" href="#form" bg="primary">
                Custom forms
              </Nav.Link>
              <Nav.Link className="bg-primary" href="#doc" bg="primary">
                Custom Document
              </Nav.Link>
              <Nav.Link className="bg-primary" href="#apitest" bg="primary">
                API Testing
              </Nav.Link>

              <Nav.Link className="bg-primary" href="#qrcode" bg="primary">
                QR Code
              </Nav.Link>
              <Nav.Link className="bg-primary" href="#tour" bg="primary">
                Tour
              </Nav.Link>
              <Nav.Link
                className="bg-primary"
                href="#pagecontent/4"
                bg="primary"
              >
                Content Viewer
              </Nav.Link>
              <Nav.Link className="bg-primary" href="#newcontent" bg="primary">
                New Content
              </Nav.Link>
            </NavDropdown>
            <NavDropdown className="bg-primary" title="Auth Pages">
              {hasAccess("Tenant") && (
                <Nav.Link className="bg-primary" href="#tenant" bg="primary">
                  Tenant Summary
                </Nav.Link>
              )}
              <Nav.Link className="bg-primary" href="#user" bg="primary">
                User Details
              </Nav.Link>

              {hasAccess("Tenant") && (
                <>
                  <Nav.Link
                    className="bg-primary"
                    href="#permissions"
                    bg="primary"
                  >
                    Permissions Summary
                  </Nav.Link>
                  <Nav.Link className="bg-primary" href="#flags" bg="primary">
                    Flags Summary
                  </Nav.Link>
                  <Nav.Link
                    className="bg-primary"
                    href="#settings"
                    bg="primary"
                  >
                    Settings Summary
                  </Nav.Link>
                </>
              )}
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
            {isLoggedIn && hasAccess("MembershipAdministration") && (
              <NavDropdown className="bg-primary" title="Administration">
                <Nav.Link
                  className="bg-primary"
                  href="#admin/application"
                  bg="primary"
                >
                  Applications
                </Nav.Link>
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
