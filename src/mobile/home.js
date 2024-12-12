import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import FloatingCard from "../components/react-bootstrap-mobile/floatingcard";
import Ticket from "../components/react-bootstrap-mobile/ticket";
import QRCode from "../packages/qrcode/qrcode";
import { NewsItems } from "../packages/news/news";

const Home = () => {
  return (
    <Container fluid className="px-2">
      <Row>
        <Col xs={12} md={6} lg={4} xl={3}>
          <FloatingCard
            className="m-3 m-3"
            style={{ backgroundColor: "purple" }}
          >
            <FloatingCard.Header>
              <div className="text-center">Partner Program</div>
            </FloatingCard.Header>
            <FloatingCard.Body>
              <div
                className="fw-bold text-center"
                style={{ fontSize: "small" }}
              >
                We support all vendors associated directly and indirectly with
                the dance community value chain. We offer a Loyalty Program,
                ticketing and scheduling support, community news and more...
              </div>
            </FloatingCard.Body>
            <FloatingCard.Footer>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => (window.location.href = "#partner")}
              >
                Join now
              </Button>
            </FloatingCard.Footer>
          </FloatingCard>
        </Col>
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
        <NewsItems items={3} layout="card" />
      </Row>
      <Row>
        <Col xs={12} md={6} lg={4}>
          <Ticket
            variant="event"
            onClick={() => {
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
        {/* Other Ticket components remain unchanged */}
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
