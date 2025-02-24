import React from "react";
import { Row, Col, Button, NavLink } from "react-bootstrap";
import Ticket from "../components/react-bootstrap-mobile/ticket";
import QRCode from "../packages/qrcode/qrcode";
import { useBookings } from "../packages/kloko/context/usebookings"; // Import useBookings hook
import InfoCard from "../components/infocard/infocard"; // Import InfoCard component
import { Balloon, Calendar, Search } from "react-bootstrap-icons";
import { formatPrice } from "../packages/kloko/eventfunctions";

const TicketDescription = ({ ticket }) => {
  console.log("Ticket", ticket)
  return (
    <div className="mt-2">
      <p><h3>{ticket.description}</h3></p>
      <p>{ticket.start_time.substr(0,10) + " - " + ticket.end_time.substr(0,10)}</p>
    </div>
  );
};

const Tickets = () => {
  const { tickets } = useBookings(); // Get tickets from useBookings hook
  
  return (
    <div style={{ height: "100%" }}>
      {tickets.length === 0 ? ( // Check if there are no tickets
        <InfoCard
          title="No Tickets"
          text="You have no tickets booked for future events."
        >
          <InfoCard.Message>
            Book your tickets <Button href={"#events"} style={{padding: "1px 12px"}}><Balloon /></Button> or book a class <Button href={"#search"} style={{padding: "1px 12px"}}><Search /></Button> to enjoy the upcoming events!
          </InfoCard.Message>
        </InfoCard>
      ) : (
        <Row>
          {tickets.map((item, index) => (
            <Col xs={12} md={6} lg={4} key={item.id}>
              <Ticket
                variant={item.eventtype}
                onClick={() => {
                  alert("Ticket Done!");
                }}
                className="m-3"
              >
                <Row>
                    <Ticket.Header>{item.event_title}</Ticket.Header>
                    </Row>
                <Row>
                  <Col>
                    <Ticket.Body><TicketDescription ticket={item} /></Ticket.Body>
                  </Col>
                  <Col
                    xs={3}
                    className="me-4"
                    style={{
                      height: "100%",
                      borderRadius: "8px",
                      padding: "0px",
                    }}
                  >
                    <QRCode
                      link={"https://juzt.dance#ticket?event=" + item?.event_id}
                      size={128}
                      logoWidth={24}
                      logoPadding={4}
                    />
                  </Col>
                </Row>
                <Ticket.Footer>
                  <Ticket.Footer.Left>{formatPrice(item.currency,item.price)}</Ticket.Footer.Left>
                  Admit {item.quantity}
                  <Ticket.Footer.Right>{item.time}</Ticket.Footer.Right>
                </Ticket.Footer>
              </Ticket>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Tickets;
