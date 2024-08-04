import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import FloatingCard from "../components/react-bootstrap-mobile/floatingcard";
import Ticket from "../components/react-bootstrap-mobile/ticket";
import QRCode from "../packages/qrcode/qrcode";

const Home = () => {
  return (
    <Container fluid className="px-2" style={{ overflow: "hidden" }}>
      <Row>
        <Col xs={12} md={6} lg={4} xl={3}>
          <FloatingCard className="m-3 m-3" image="./whitedance.png">
            <FloatingCard.Header>
              <p className="text-center">Dancing in White</p>
            </FloatingCard.Header>
            <FloatingCard.Body>
              <div style={{ backgroundColor: "rgba(255,255,255,0.4)" }}>
                <p className="fw-bold">
                  The world wide white dance event is back! Dress in white and
                  dance the night away.
                </p>
              </div>
            </FloatingCard.Body>
            <FloatingCard.Footer>
              <Button variant="primary">Book Now</Button>
            </FloatingCard.Footer>
          </FloatingCard>
        </Col>

        <Col xs={12} md={6} lg={4} xl={3}>
          <FloatingCard
            className="m-3"
            image="./dance.png"
            onClick={() => {
              console.log("Home Card Clicked");
            }}
          >
            <FloatingCard.Header>The Amaaazzzing Festival</FloatingCard.Header>
            <FloatingCard.Body
              style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
            >
              Afro-latin dance festival in Zambia. Inspires individuals to be
              Amazing in all they do.
            </FloatingCard.Body>
            <FloatingCard.Footer>
              <Button variant="primary">Book Now</Button>
            </FloatingCard.Footer>
          </FloatingCard>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6} lg={4}>
          <Ticket
            variant="event"
            onClick={() => {
              console.log("Home Ticket Click");
              alert("Ticket Done!");
            }}
            className="m-3"
          >
            <Row>
              <Col>
                <Ticket.Header>Event: Salsa Party</Ticket.Header>
                <Ticket.Body>
                  Evening Salsa Party, DJ TopHat. Dress to impress!
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
                  link="Testing"
                  size={128}
                  logoWidth={24}
                  logoPadding={4}
                />
              </Col>
            </Row>
            <Ticket.Footer>
              <Ticket.Footer.Left>$80</Ticket.Footer.Left>
              Admit 1<Ticket.Footer.Right>2024\08\05 20:00</Ticket.Footer.Right>
            </Ticket.Footer>
          </Ticket>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Ticket
            onClick={() => {
              alert("Ticket Done!");
            }}
            className="m-3"
          >
            <Row>
              <Col>
                <Ticket.Header>Salsa Party</Ticket.Header>
                <Ticket.Body>
                  Evening Salsa Party, DJ TopHat. Dress to impress!
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
                  link="Testing"
                  size={128}
                  logoWidth={24}
                  logoPadding={4}
                />
              </Col>
            </Row>
            <Ticket.Footer>
              <Ticket.Footer.Left>$80</Ticket.Footer.Left>
              Admit 1<Ticket.Footer.Right>20:00</Ticket.Footer.Right>
            </Ticket.Footer>
          </Ticket>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Ticket
            onClick={() => {
              alert("Ticket Done!");
            }}
            className="m-3"
          >
            <Row>
              <Col>
                <Ticket.Header>Salsa Party</Ticket.Header>
                <Ticket.Body>
                  Evening Salsa Party, DJ TopHat. Dress to impress!
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
                  link="Testing"
                  size={128}
                  logoWidth={24}
                  logoPadding={4}
                />
              </Col>
            </Row>
            <Ticket.Footer>
              <Ticket.Footer.Left>$80</Ticket.Footer.Left>
              Admit 1<Ticket.Footer.Right>20:00</Ticket.Footer.Right>
            </Ticket.Footer>
          </Ticket>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
