import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import {
  Balloon,
  Calendar,
  Cart,
  Gear,
  Heart,
  InfoCircle,
  Map,
  Receipt,
} from "react-bootstrap-icons";
import Bar from "../../../components/react-bootstrap-mobile/bar";
import useUser from "../../../packages/auth/context/useuser";
import "./partnerbar.scss";
import PartnerSignupModal from "./partnersignup";

const PartnerBar = () => {
  const { user, hasAccess } = useUser();

  if (!user) {
    return null;
  }
  return (
    <Bar
      onSelect={(key) => {
        window.location.hash = key;
      }}
      className="partner-bar px-2"
    >
      {hasAccess("Calendar") && (
        <Nav.Link eventKey="#calendar">
          <Calendar className="ms-1" />
        </Nav.Link>
      )}
      {/* {hasAccess("Store") && (
        <Nav.Link eventKey="#store">
          <Cart className="ms-1" />
        </Nav.Link>
      )} */}
      {hasAccess("Loyalty") && (
        <Nav.Link eventKey="#partner/loyalty">
          <Heart className="ms-1" />
        </Nav.Link>
      )}
      {/* {hasAccess("Orders") && (
        <Nav.Link eventKey="#orders">
          <Receipt className="ms-1" />
        </Nav.Link>
      )} */}

      {hasAccess("Events") && (
        <Nav.Link eventKey="#events/myevents">
          <Balloon className="ms-1" />
        </Nav.Link>
      )}
      <Nav.Link eventKey="#news/mynews">
        <InfoCircle className="ms-1" />
      </Nav.Link>
      <Nav.Link eventKey="#locations">
        <Map className="ms-1" />
      </Nav.Link>
      <Nav.Link eventKey="#partner">
        <Gear className="ms-1" />
      </Nav.Link>
    </Bar>
  );
};

export default PartnerBar;
