import React, { useState, useRef } from "react";
import "./ticket.scss";

const Ticket = ({
  variant = "primary",
  children,
  onClick,
  className,
  style,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ticketRef = useRef(null);

  const handleClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      setIsExpanded(false);
      if (onClick) {
        onClick();
      }
    });
  };

  return (
    <div
      className={`ticket ${variant ? `ticket-${variant}` : ""} ${
        className || ""
      } ${isExpanded ? "expanded" : ""}`}
      style={style}
      onClick={handleClick}
      ref={ticketRef}
      role="button"      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
      tabIndex={0}
    >
      <div className="notch notch-left"></div>
      <div className="notch notch-right"></div>
      {children}
    </div>
  );
};

const TicketHeader = ({ children, className, style }) => (
  <div className={`ticket-header ${className || ""}`} style={style}>
    {children}
  </div>
);

const TicketBody = ({ children, className, style }) => (
  <div className={`ticket-body ${className || ""}`} style={style}>
    {children}
  </div>
);

const TicketFooter = ({ children, className, style }) => (
  <div className={`ticket-footer ${className || ""}`} style={style}>
    {children}
  </div>
);

const TicketFooterLeft = ({ children, className, style }) => (
  <div className={`ticket-footer-left ${className || ""}`} style={style}>
    {children}
  </div>
);

const TicketFooterRight = ({ children, className, style }) => (
  <div className={`ticket-footer-right ${className || ""}`} style={style}>
    {children}
  </div>
);

Ticket.Header = TicketHeader;
Ticket.Body = TicketBody;
Ticket.Footer = TicketFooter;
Ticket.Footer.Left = TicketFooterLeft;
Ticket.Footer.Right = TicketFooterRight;

export default Ticket;
