import React from "react";
import { Row, Col, Button, NavLink } from "react-bootstrap";
import Ticket from "../components/react-bootstrap-mobile/ticket";
import QRCode from "../packages/qrcode/qrcode";
import { useBookings } from "../packages/kloko/context/usebookings"; // Import useBookings hook
import InfoCard from "../components/infocard/infocard"; // Import InfoCard component
import { Balloon, Calendar, Search } from "react-bootstrap-icons";
import { formatPrice } from "../packages/kloko/eventfunctions";
import Tracker from "../packages/tracker/tracker";



const Tickets = () => {
  const { tickets } = useBookings(); // Get tickets from useBookings hook

  return (
    <Tracker itemtype="tickets" id={"page"}>
      <div style={{ height: "100%" }}>
        {tickets.length === 0 ? ( // Check if there are no tickets
          <InfoCard
            title="No Tickets"
            text="You have no tickets booked for future events."
          >
            <InfoCard.Message>
              Book your tickets{" "}
              <Button href={"#events"} style={{ padding: "1px 12px" }}>
                <Balloon />
              </Button>{" "}
              or book a class{" "}
              <Button href={"#search"} style={{ padding: "1px 12px" }}>
                <Search />
              </Button>{" "}
              to enjoy the upcoming events!
            </InfoCard.Message>
          </InfoCard>
        ) : (
          <Row>
            {tickets.map((item, index) => (
              <Col xs={12} md={6} lg={4} key={item.id}>
                <Tracker itemtype="ticket.card" id={item.ticket_id}>
                  <Ticket
                    ticket={item}
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
                        <Ticket.Body>
                          <Ticket.Description ticket={item} />
                        </Ticket.Body>
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
                          link={
                            "https://juzt.dance#ticket?event=" + item?.event_id
                          }
                          size={128}
                          logoWidth={24}
                          logoPadding={4}
                        />
                      </Col>
                    </Row>
                    <Ticket.Footer>
                      <Ticket.Footer.Left>
                        {formatPrice(item.currency, item.price)}
                      </Ticket.Footer.Left>
                      Admit {item.quantity}
                      <Ticket.Footer.Right>{item.time}</Ticket.Footer.Right>
                    </Ticket.Footer>
                  </Ticket>
                </Tracker>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Tracker>
  );
};

export default Tickets;
