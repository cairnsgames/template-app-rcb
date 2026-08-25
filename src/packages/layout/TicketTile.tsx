import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { QRCode } from "react-qrcode-logo";
import { Colors } from "../../styles/colors";
import Tracker from "../tracker/tracker";
import Ticket from "../../components/react-bootstrap-mobile/ticket";
import { formatPrice } from "../kloko/eventfunctions";
import { TileData } from "./layout.types";

type TicketSubComponent = React.FC<React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>>;
type TicketFooterType = TicketSubComponent & { Left: TicketSubComponent; Right: TicketSubComponent };

type TileDescriptionProps = {
  description?: string | string[];
};

const TileDescription = ({ description }: TileDescriptionProps) => {
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

type TicketTileProps = {
  data: TileData;
  onClick: (data: TileData) => void;
};

const TicketTile = ({ data, onClick }: TicketTileProps) => {
  const { raw = {} } = data;
  const item = data;
  const color = Colors.primary;
  const TicketFooter = Ticket.Footer as unknown as TicketFooterType;

  return (
    <div className="tile-wrapper mb-4">
      <Tracker itemtype={data.tracker} id={data.id} itemid={data.id}>
        <Ticket
          ticket={item}
          variant={item.type}
          onClick={() => {
            alert("Ticket Done!");
          }}
          className=""
          style={{}}
        >
          <Row>
            <Ticket.Header className="" style={{}}>{item.title}</Ticket.Header>
          </Row>
          <Row>
            <Col>
              <Ticket.Body className="" style={{}}>
                <Ticket.Description ticket={item} />
              </Ticket.Body>
            </Col>
            <Col
              xs={3}
              className="me-4"
              style={{ height: "100%", borderRadius: "8px", padding: "0px" }}
            >
              <QRCode
                value={"https://juzt.dance#ticket?event=" + item?.event_id}
                size={128}
                logoWidth={24}
                logoPadding={4}
              />
            </Col>
          </Row>
          <TicketFooter className="" style={{}}>
            <TicketFooter.Left className="" style={{}}>
              {formatPrice(item.raw?.currency, item.raw?.price)}
            </TicketFooter.Left>
            Admit {item.quantity ?? item.raw?.quantity}
            <TicketFooter.Right className="" style={{}}>{item.raw?.start_time}</TicketFooter.Right>
          </TicketFooter>
        </Ticket>
      </Tracker>
    </div>
  );
};

export default TicketTile;
