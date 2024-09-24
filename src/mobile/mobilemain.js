import React, { useState } from "react";
import { Container, Dropdown, Navbar, Nav, Image } from "react-bootstrap";
import {
  House,
  CardChecklist,
  Search,
  TicketDetailed,
  List,
  QrCode,
  InfoCircle,
  CalendarWeek,
  BalloonHeart,
} from "react-bootstrap-icons";

import "./mobile.scss";
import Footer from "../components/react-bootstrap-mobile/footer";
import Bar from "../components/react-bootstrap-mobile/bar";
import FavIcon from "./svg/favicon";
import BreezoCart from "../packages/breezo/breezocart";
import Routing from "./routing";
import useAuth from "../packages/auth/context/useauth";
import useUser from "../packages/auth/context/useuser";
import PartnerBar from "./partnerbar";
import { AssistantProvider } from "./assistant/assistantprovider";
import FaceDropdown from "./facedropdown.js/facedropdown";


const MobileMain = () => {
  const { hasAccess } = useUser();

  return   <Container fluid className="app-container">
    <header className="app-header">
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
            <FaceDropdown />
          </Nav>
        </Container>
      </Navbar>
      {hasAccess("Partner") && <PartnerBar />}
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
  </Container>;
};

export default MobileMain;
