import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import {
  Balloon,
  Calendar,
  Cart,
  Heart,
  InfoCircle,
  Receipt,
} from "react-bootstrap-icons";
import Bar from "../../../components/react-bootstrap-mobile/bar";
import useUser from "../../../packages/auth/context/useuser";

const PartnerBar = () => {
  const { user, hasAccess } = useUser();

  if (!user) {
    return null;
  }
  return (
    <Bar
      variant="event"
      onSelect={(key) => {
        window.location.hash = key;
      }}
      className="px-2"
    >
      {hasAccess("Calendar") && (
        <Nav.Link eventKey="#calendar">
          <Calendar />
        </Nav.Link>
      )}
      {hasAccess("Store") && (
        <Nav.Link eventKey="#store">
          <Cart />
        </Nav.Link>
      )}
      {hasAccess("Loyalty") && (
        <Nav.Link eventKey="#partner/loyalty">
          <Heart />
        </Nav.Link>
      )}
      {hasAccess("Orders") && (
        <Nav.Link eventKey="#orders">
          <Receipt />
        </Nav.Link>
      )}

      {hasAccess("Events") && (
        <Nav.Link eventKey="#events">
          <Balloon />
        </Nav.Link>
      )}
      <Nav.Link eventKey="#news/mynews">
        <InfoCircle />
      </Nav.Link>
    </Bar>
  );
};

export default PartnerBar;
