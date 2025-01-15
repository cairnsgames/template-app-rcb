import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import FloatingCard from "../components/react-bootstrap-mobile/floatingcard";
import Ticket from "../components/react-bootstrap-mobile/ticket";
import QRCode from "../packages/qrcode/qrcode";
import { NewsItems } from "../packages/news/news";
import { EventItems } from "../packages/kloko/klokoeventsasnews";

const Home = () => {
  const showNews = (item) => {
    console.log("Show News", item);
    window.location.hash = `#news/${item.id}`;
  };
  const showEvent = (item) => {
    console.log("Show Event", item);
    window.location.hash = `#events/${item.id}`;
  };
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
        <NewsItems items={3} layout="card" onClick={showNews} />
        <EventItems items={3} layout="card" onClick={showEvent} />
      </Row>
    </Container>
  );
};

export default Home;
