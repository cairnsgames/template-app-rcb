import React, { useState, useRef } from "react";
import "./ticket.scss";

const Ticket = (props) => {
  const {
    variant = "primary",
    ticket,
    children,
    onClick,
    className,
    style,
  } = props;
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
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
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

const TicketDescription = ({ ticket }) => {
  const start_time = ticket.start_time ?? ticket.raw?.start_time;
  const end_time = ticket.end_time ?? ticket.raw?.end_time;

  const formatTime = (time) => time.substr(11, 5); // Extract HH:MM
  const formatDate = (time) => time.substr(0, 10); // Extract YYYY-MM-DD

  const startDate = start_time ? formatDate(start_time) : null;
  const endDate = end_time ? formatDate(end_time) : null;

  return (
    <div className="mt-2">
      <p>
        <strong>{ticket.raw?.event_description ?? ticket.description}</strong>
      </p>
      {start_time && end_time && (
        <p>
          {startDate === endDate
            ? `${startDate} ${formatTime(start_time)} - ${formatTime(end_time)}`
            : `${startDate} - ${endDate}`}
        </p>
      )}
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
Ticket.Description = TicketDescription;

export default Ticket;
