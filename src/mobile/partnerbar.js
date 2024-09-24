import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import {
    BalloonHeartFill,
  Calendar,
  CalendarFill,
  CardImage,
  Cart,
  Cart2,
  CartFill,
  InfoCircle,
  Receipt,
} from "react-bootstrap-icons";
import Bar from "../components/react-bootstrap-mobile/bar";
import useUser from "../packages/auth/context/useuser";

const PartnerBar = () => {
  const [activeBarItem, setActiveBarItem] = useState();
  const { user, hasAccess } = useUser();

  console.log("=== PartnerBar, user", user)

  useEffect(() => {
    if (activeBarItem) {
      window.location.hash = activeBarItem;
    }
  }, [activeBarItem]);

  if (!user) {
    return null;
  }
  return (
    <Bar
      variant="event"
      defaultActiveKey={activeBarItem}
      onSelect={(key) => {
        setActiveBarItem(key);
      }}
      className="px-2"
    >
      {hasAccess("Calendar") && (
        <Nav.Link eventKey="#calendar">
          <CalendarFill />
        </Nav.Link>
      )}
      {hasAccess("Store") && (
        <Nav.Link eventKey="#store">
          <CartFill />
        </Nav.Link>
      )}
      {hasAccess("Loyalty") && (
        <Nav.Link eventKey="#partner/loyalty">
          <CardImage />
        </Nav.Link>
      )}
      {hasAccess("Orders") && (
        <Nav.Link eventKey="#orders">
          <Receipt />
        </Nav.Link>
      )}
      
      {hasAccess("Events") && (
        <Nav.Link eventKey="#events">
          <BalloonHeartFill />
        </Nav.Link>
      )}
              <Nav.Link eventKey="#news/mynews">
          <InfoCircle />
        </Nav.Link>
    </Bar>
  );
};

export default PartnerBar;
