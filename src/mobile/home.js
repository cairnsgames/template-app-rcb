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
import Tracker from "../packages/tracker/tracker";

const Home = () => {
  const { newsItems } = useNews();

  const { events } = useEvents();
  const { tickets } = useMyEvents();

  const [newsCards, setNewsCards] = useState([]);
  const [ticketCards, setTicketCards] = useState([]);
  const [eventCards, setEventCards] = useState([]);

  useEffect(() => {
    if (newsItems.length > 0) {
      setNewsCards([]);
    }
    if (newsItems) {
      setNewsCards(newsAsCards(newsItems));
    }
  }, [newsItems]);

  useEffect(() => {
    if (tickets.length > 0) {
      setTicketCards([]);
    }
    if (tickets) {
      setTicketCards(ticketsAsCards(tickets));
    }
  }, [tickets]);

  useEffect(() => {
    if (events.length > 0) {
      setEventCards([]);
    }
    if (events) {
      setEventCards(eventsAsCards(events));
    }
  }, [events]);

  const formatEventTime = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const isSameDay = startDate.toDateString() === endDate.toDateString();

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (isSameDay) {
      const options = { hour: '2-digit', minute: '2-digit' };
      return `${formatDate(startDate)} ${startDate.toLocaleTimeString([], options)} - ${endDate.toLocaleTimeString([], options)}`;
    } else {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  };

  const newsAsCards = (news) => {
    console.log("NEWS", news);
    return news.map((item) => {
      // console.log("News Item", item);
      return {
        type: "news",
        id: item.id,
        tracker: "news.card",
        image: combineUrlAndPath(process.env.REACT_APP_FILES, item.image_url),
        title: item.title,
        description: item.body,
        footer: "",//item.date,
        overlayText: item.overlay_text === "Y",
        overlay: item.overlay_text,
      };
    });
  };

  const eventsAsCards = (events) => {
    console.log("EVENTS AS NEWS", events);
    return events.map((event) => {
      return {
        type: "event",
        id: event.id,
        tracker: "event.card",
        image: combineUrlAndPath(process.env.REACT_APP_FILES, event.image),
        title: event.title,
        description: event.description,
        footer: formatEventTime(event.start_time, event.end_time),
        overlayText: event.overlay_text === "Y",
        overlay: event.overlay_text,
        taget: ""
      };
    });
  };

  const ticketsAsCards = (tickets) => {
    return tickets.map((ticket) => {
      const desc = [];
      desc.push(<h3>{ticket.description}</h3>);
      return {
        type: "ticket",
        id: ticket.ticket_id,
        tracker: "ticket.card",
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
    <Tracker itemtype="home" id={"page"}>
      
      <TilesLayout>
        <TileList images={newsCards} onClick={showNews} />
        <TileList images={eventCards} onClick={showEvent} />
        <TileList images={ticketCards} onClick={showEvent} />
        
        <PartnerCard />
      </TilesLayout>
      </Tracker>
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
