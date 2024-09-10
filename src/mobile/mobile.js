import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  Navbar,
  Nav,
  Image,
} from "react-bootstrap";
import {
  House,
  CardChecklist,
  Search,
  Calendar,
  TicketDetailed,
  List,
  QrCode,
  InfoCircle,
  CalendarWeek,
  BalloonHeart,
  Camera,
} from "react-bootstrap-icons";

import "./mobile.scss";
import Footer from "../components/react-bootstrap-mobile/footer";
import Bar from "../components/react-bootstrap-mobile/bar";
import FavIcon from "./svg/favicon";
import BreezoCart from "../packages/breezo/breezocart";
import Routing from "./routing";
import useAuth from "../packages/auth/context/useauth";
import PartnerBar from "./partnerbar";
import useUser from "../packages/auth/context/useuser";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ display: "inline-block" }}
  >
    {children}
  </div>
));

const MobileApp = () => {
  const { logout, isLoggedIn } = useAuth();
  const { hasAccess } = useUser();

  console.log("MobileApp");
  return (
    <Container fluid className="app-container">
      <header className="app-header">
        <Navbar className="px-3" bg="primary" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="#home">
              <FavIcon
                className="me-3"
                size={32}
                color={"white"}
                lineWidth="3"
              />{" "}
              Juzt Dance
            </Navbar.Brand>
            <Nav className="ms-auto  align-items-center">
              <Nav.Item>
                <BreezoCart />
              </Nav.Item>
              <Dropdown align="end">
                <Dropdown.Toggle
                  as={CustomToggle}
                  id="dropdown-custom-components"
                >
                  <Image
                    roundedCircle
                    src="person1.jpeg"
                    style={{ height: "32px", cursor: "pointer" }}
                    className="ms-2"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#profile">Profile</Dropdown.Item>
                  <Dropdown.Item href="#partner">Partner</Dropdown.Item>
                  <Dropdown.Item href="#settings">Settings</Dropdown.Item>
                  <Dropdown.Item href="#landing">About</Dropdown.Item>
                  {isLoggedIn && <Dropdown.Item
                    onClick={() => {
                      logout();
                      window.location.hash = "home";
                    }}
                  >
                    Logout
                  </Dropdown.Item>}
                  {!isLoggedIn && <Dropdown.Item href="#login">Login</Dropdown.Item>}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Container>
        </Navbar>
        {hasAccess("Partner") &&
        <PartnerBar />
}
      </header>
      <main className="app-body">
        <Routing />
      </main>
      <Footer variant="event">
        <Footer.Icon href="#home">
          <House size={24} />
          <div style={{ fontSize: "12px", fontWeight: "600" }}>Home</div>
        </Footer.Icon>
        <Footer.Icon href="#search">
          <Search size={24} />
          <div style={{ fontSize: "12px", fontWeight: "600" }}>Search</div>
        </Footer.Icon>
        <Footer.Icon href="#tickets">
          <TicketDetailed size={24} />
          <div style={{ fontSize: "12px", fontWeight: "600" }}>Tickets</div>
        </Footer.Icon>
        <Footer.Icon href="#loyaltycarousel">
          <CardChecklist size={24} />
          {/* <Camera size={24} /> */}
          <div style={{ fontSize: "12px", fontWeight: "600" }}>Loyalty</div>
        </Footer.Icon>
        <Footer.Center>
          <Footer.Icon href="#events">
            <BalloonHeart size={24} />
          </Footer.Icon>
          <Footer.Icon href="#news">
            <InfoCircle size={24} />
          </Footer.Icon>
          <Footer.Icon href="#qrcode">
            <QrCode size={24} />
          </Footer.Icon>
          <Footer.Icon href="#mycalendar">
            <CalendarWeek size={24} />
          </Footer.Icon>
          <Footer.Icon href="#news/mynews">
            <List size={24} />
          </Footer.Icon>
        </Footer.Center>
      </Footer>
    </Container>
  );
};

export default MobileApp;

/*
 return (
    <Container fluid style={{ overflow: "hidden" }}>
      <Navbar className="px-3" bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">
            <FavIcon className="me-3" size={32} color={"white"} lineWidth="3" />{" "}
            Juzt Dance
          </Navbar.Brand>
          <Nav className="ms-auto  align-items-center">
            <Nav.Item>
              <BreezoCart />
            </Nav.Item>
            <Dropdown align="end">
              <Dropdown.Toggle
                as={CustomToggle}
                id="dropdown-custom-components"
              >
                <Image
                  roundedCircle
                  src="person1.jpeg"
                  style={{ height: "32px", cursor: "pointer" }}
                  className="ms-2"
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#profile">Profile</Dropdown.Item>
                <Dropdown.Item href="#settings">Settings</Dropdown.Item>
                <Dropdown.Item onClick={()=>{
                  logout();
                  window.location.hash="home";
                }}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
      <Bar
        variant="event"
        defaultActiveKey={activeBarItem}
        onSelect={(key) => setActiveBarItem(key)}
        className="px-2"
      >
        <Nav.Link eventKey="home">Home</Nav.Link>
        <Nav.Link eventKey="#login">Login</Nav.Link>
        <Nav.Link eventKey="#calendar"><Calendar /></Nav.Link>
        <Nav.Link eventKey="settings">Settings</Nav.Link>
        <Nav.Link eventKey="info">Info</Nav.Link>
        <Nav.Link eventKey="details2">Details</Nav.Link>
        <Nav.Link eventKey="settings2">Settings</Nav.Link>
        <Nav.Link eventKey="info2">Info</Nav.Link>
        <Nav.Link eventKey="details3">Details</Nav.Link>
        <Nav.Link eventKey="settings3">Settings</Nav.Link>
      </Bar>
      <Routing />
      <Footer variant="event">
        <Footer.Icon href="#home">
          <House size={24} />
          <div style={{ fontSize: "12px", fontWeight: "600" }}>Home</div>
        </Footer.Icon>
        <Footer.Icon href="#search">
          <Search size={24} />          
          <div style={{ fontSize: "12px", fontWeight: "600" }}>Search</div>
        </Footer.Icon>
        <Footer.Icon href="#tickets">
          <TicketDetailed size={24} />
          <div style={{ fontSize: "12px", fontWeight: "600" }}>Tickets</div>
        </Footer.Icon>
        <Footer.Icon href="#loyaltycarousel">
          <CardChecklist size={24} />
          <div style={{ fontSize: "12px", fontWeight: "600" }}>Loyalty</div>
        </Footer.Icon>
        <Footer.Center>
          <Footer.Icon href="#events">
            <BalloonHeart size={24} />
          </Footer.Icon>
          <Footer.Icon href="#news">
            <InfoCircle size={24} />
          </Footer.Icon>
          <Footer.Icon href="#qrcode">
            <QrCode size={24} />
          </Footer.Icon>
          <Footer.Icon href="#mycalendar">
            <CalendarWeek size={24}/>
          </Footer.Icon>
        </Footer.Center>
      </Footer>
    </Container>
  );
*/
