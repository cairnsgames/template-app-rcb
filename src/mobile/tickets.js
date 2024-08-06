import React from "react";
import { Row, Col } from "react-bootstrap";
import Ticket from "../components/react-bootstrap-mobile/ticket";
import QRCode from "../packages/qrcode/qrcode";

const items = [
    {
        id: 21,
        name: "Class: Kizomba Beginners",
        description: "Beginners Kizomba class, all welcome, bring a friend (free)",
        qrcode: "images/rest1.png",
        price: 50,
        admit: 1,
        time: "2024-08-09 19:00",
      },
  {
    id: 1,
    eventtype: "event",
    name: "Event: The Amaaazing Festival",
    description: "Evening Salsa Party, DJ TopHat. Dress to impress!",
    qrcode: "images/rest1.png",
    price: 80,
    admit: 1,
    time: "2024-08-05 20:00",
  },
  {
    id: 2,
    name: "Class: Salsa Beginners",
    description: "Beginners Salsa class, all welcome",
    qrcode: "images/rest1.png",
    price: 50,
    admit: 1,
    time: "2024-08-09 19:00",
  },
  {
    id: 1001,
    eventtype: "party",
    name: "Party: Friday Night Party",
    description: "Friday Night Party, DJ WhatsIsName. Dress code: Casual!",
    qrcode: "images/rest1.png",
    price: 20,
    admit: 1,
    time: "2024-08-05 20:00",
  },
  {
    id: 24,
    name: "Class: Salsa Beginners",
    description: "Beginners Salsa class, all welcome",
    qrcode: "images/rest1.png",
    price: 50,
    admit: 1,
    time: "2024-08-09 19:00",
  },
  {
    id: 23,
    name: "Class: Salsa Beginners",
    description: "Beginners Salsa class, all welcome",
    qrcode: "images/rest1.png",
    price: 50,
    admit: 1,
    time: "2024-08-09 19:00",
  }
];

const Tickets = () => {
  return (
    <div style={{ height: "100%" }}>
      <Row>
        {items.map((item, index) => (
          <Col xs={12} md={6} lg={4} key={item.id}>
            <Ticket
              variant={item.eventtype}
              onClick={() => {
                alert("Ticket Done!");
              }}
              className="m-3"
            >
              <Row>
                <Col>
                  <Ticket.Header>{item.name}</Ticket.Header>
                  <Ticket.Body>
                    {item.description}
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
                    link={item.qrcode}
                    size={128}
                    logoWidth={24}
                    logoPadding={4}
                  />
                </Col>
              </Row>
              <Ticket.Footer>
                <Ticket.Footer.Left>${item.price}</Ticket.Footer.Left>
                Admit {item.admit}
                <Ticket.Footer.Right>{item.time}</Ticket.Footer.Right>
              </Ticket.Footer>
            </Ticket>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Tickets;
