import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import FloatingCard from "../components/react-bootstrap-mobile/floatingcard";
import { useNews } from "../packages/news/context/newscontext";
import { useEvents } from "../packages/kloko/context/useevents";
import { combineUrlAndPath } from "../functions/combineurlandpath";
import TilesLayout from "../packages/layout/Tiles";
import TileList from "../packages/layout/TileList";
import PartnerCard from "./partnercard";
import useMyEvents from "../packages/kloko/context/usemyevents";
import { formatPrice } from "../packages/kloko/eventfunctions";

const Home = () => {
  const { newsItems } = useNews();

  const { events } = useEvents();
  const { tickets } = useMyEvents();

  const [newsCards, setNewsCards] = useState([]);

  useEffect(() => {
    if (newsItems.length > 0) {
      setNewsCards([]);
    }
    if (newsItems) {
      setNewsCards(newsAsCards(newsItems));
    }
  }, [newsItems]);

  const newsAsCards = (news) => {
    console.log("NEWS", news);
    return news.map((item) => {
      return {
        id: item.id,
        image: combineUrlAndPath(process.env.REACT_APP_FILES, item.image_url),
        title: item.title,
        description: item.description,
        footer: item.date,
        overlayText: item.overlayText,
      };
    });
  };

  const eventsAsCards = (events) => {
    return events.map((event) => {
      return {
        id: event.id,
        image: combineUrlAndPath(process.env.REACT_APP_FILES, event.image),
        title: event.title,
        description: event.description,
        footer: event.date,
        overlayText: event.overlayText,
      };
    });
  };

  const ticketsAsCards = (tickets) => {
    return tickets.map((ticket) => {
      const desc = [];
      desc.push(ticket.start_time.substr(0,10) + " - " + ticket.end_time.substr(0,10));
      desc.push(<h3>{ticket.description}</h3>);
      return {
        id: ticket.id,
        image: combineUrlAndPath(process.env.REACT_APP_FILES, ticket.image),
        title: ticket.event_title,
        description:  desc ,
        footer: "Admit "+ticket.quantity+" ("+formatPrice(ticket.currency, ticket.price)+")",
        overlayText: true,
        qrcode: true,
        raw: ticket
      };
    });
  }

  const showNews = (item) => {
    console.log("Show News", item);
    window.location.hash = `#news/${item.id}`;
  };
  const showEvent = (item) => {
    console.log("Show Event", item);
    window.location.hash = `#events/${item.id}`;
  };

  console.log("newsAsCards", newsCards);

  return (
    <Container fluid className="p-3">
      <TilesLayout>
        <TileList images={newsCards} onClick={showNews} />
        <TileList images={eventsAsCards(events)} onClick={showEvent} />
        <TileList images={ticketsAsCards(tickets)} onClick={showEvent} />
        
        <PartnerCard />
      </TilesLayout>
    </Container>
  );

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
