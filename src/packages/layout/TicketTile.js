import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { QRCode } from "react-qrcode-logo";
import { Colors } from "../../styles/colors";
import Tracker from "../tracker/tracker";
import Ticket from "../../components/react-bootstrap-mobile/ticket";
import { formatPrice } from "../kloko/eventfunctions";
import { isAccordionItemSelected } from "react-bootstrap/esm/AccordionContext";

const TileDescription = ({ description }) => {
  if (Array.isArray(description)) {
    return (
      <>
        {description.map((desc, index) => (
          <Card.Text as="div" key={index} className="text-white">
            {desc}
          </Card.Text>
        ))}
      </>
    );
  }

  return <Card.Text className="text-white">{description}</Card.Text>;
};

const TicketTile = ({ data, onClick }) => {
  const {
    title,
    image,
    description,
    footer,
    overlayText = true,
    qrcode = false,
    raw = {},
  } = data;

  const item = data;

  const link = "https://juzt.dance#ticket?event=" + raw?.event_id;

  const size = 128,
    logoPadding = 4,
    logoWidth = 64,
    logoImage = "logo192.png",
    color = Colors.primary;

  const placeholderImage = (
    <div
      className="w-100 d-flex align-items-center justify-content-center "
      style={{
        aspectRatio: "10 / 10",
        borderRadius: "0.5rem",
        backgroundColor: "black", //"#cf99cf",
        border: "5px solid greay", //"5px solid #e7cce7",
      }}
    ></div>
  );

  return (
    <div className="tile-wrapper mb-4">
      <Tracker itemtype={data.tracker} id={data.id}>
      <Ticket
                    ticket={item}
                    variant={item.eventtype}
                    onClick={() => {
                      alert("Ticket Done!");
                    }}
                    className=""
                  >
                    <Row>
                      <Ticket.Header>{item.title ?? isAccordionItemSelected.raw?.title}</Ticket.Header>
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
                        {formatPrice(item.raw?.currency, item.raw?.price)}
                      </Ticket.Footer.Left>
                      Admit {item.quantity ?? item.raw?.quantity}
                      <Ticket.Footer.Right>{item.raw?.start_time}</Ticket.Footer.Right>
                    </Ticket.Footer>
                  </Ticket>
      </Tracker>
    </div>
  );
};

export default TicketTile;
