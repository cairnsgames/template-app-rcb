import React from "react";
import { Card } from "react-bootstrap";
import { QRCode as QRCodeLogo } from "react-qrcode-logo";
import { Colors } from "../../styles/colors";
import Tracker from "../tracker/tracker";
import FavoriteIcon from "../kloko/FavoriteIcon";
import { TileData } from "./layout.types";

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

type TileFormatProps = {
  data: TileData;
  onClick: (data: TileData) => void;
};

const TileFormat = ({ data, onClick }: TileFormatProps) => {
  const {
    title,
    image,
    description,
    footer,
    overlayText = true,
    qrcode = false,
    raw = {},
  } = data;

  const link = "https://juzt.dance#ticket?event=" + raw?.event_id;

  const size = 128,
    logoPadding = 4,
    logoWidth = 64,
    logoImage = "logo192.png",
    color = Colors.primary;

  const placeholderImage = (
    <div
      className="w-100 ratio ratio-9x16 d-flex align-items-center justify-content-center"
      style={{
        aspectRatio: "10 / 10",
        borderRadius: "0.5rem",
        backgroundColor: "black",
        border: "5px solid grey",
      }}
    />
  );

  let showStar = false;
  let starFilled = false;
  if (raw && typeof raw.favorite !== "undefined") {
    if (raw.favorite === 1) {
      showStar = true;
      starFilled = true;
    } else if (data.type === "event") {
      showStar = true;
      starFilled = false;
    }
  } else if (data.type === "event") {
    showStar = true;
    starFilled = false;
  }

  return (
    <div className="tile-wrapper mb-4">
      <Tracker itemtype={data.tracker} id={data.id} itemid={data.id}>
        <Card className={data.type} onClick={() => onClick(data)}>
          <div style={{ position: "relative" }}>
            {image ? (
              <div style={{ position: "relative" }}>
                <Card.Img variant="top" src={image} alt={title} />
                {showStar && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 10,
                      filter: "drop-shadow(0 0 8px #a020f0)",
                    }}
                  >
                    <FavoriteIcon
                      event_id={data.id}
                      favorite={raw.favorite}
                      style={{ verticalAlign: "middle" }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                {placeholderImage}
                {showStar && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      zIndex: 10,
                      filter: "drop-shadow(0 0 8px #a020f0)",
                    }}
                  >
                    <FavoriteIcon
                      event_id={raw.event_id}
                      favorite={raw.favorite}
                      style={{ verticalAlign: "middle" }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {overlayText && (
            <Card.ImgOverlay className="d-flex flex-column justify-content-between p-2 px-3">
              <Card.Header className="text-white bg-transparent border-0 text-center">
                <h5 className="mb-0">{title}</h5>
              </Card.Header>
              {qrcode && (
                <div className="text-center">
                  <QRCodeLogo
                    size={size}
                    value={`${link}`}
                    fgColor={color}
                    ecLevel="H"
                    logoPadding={logoPadding}
                    logoWidth={logoWidth}
                    logoPaddingStyle="circle"
                    quietZone={2}
                  />
                </div>
              )}
              <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
                <TileDescription description={description} />
              </div>
              <Card.Footer className="text-white text-center bg-transparent border-0 w-100">
                {footer}
              </Card.Footer>
            </Card.ImgOverlay>
          )}
        </Card>
      </Tracker>
    </div>
  );
};

export default TileFormat;
