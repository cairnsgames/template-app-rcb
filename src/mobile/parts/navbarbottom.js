import React from "react";
import Footer from "../../components/react-bootstrap-mobile/footer";
import {
    House,
    Search,
    TicketDetailed,
    CardChecklist,
    Balloon,
    InfoCircle,
    QrCode,
    CalendarWeek,
    GeoAlt,
    } from "react-bootstrap-icons";
import { Container } from "react-bootstrap";

const NavBarbottom = () => {
    return (
        <div className="footer-nav">
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
          <Balloon size={24} />
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
          <GeoAlt size={24} />
        </Footer.Icon>
      </Footer.Center>
    </Footer>
    </div>)
}

export default NavBarbottom;