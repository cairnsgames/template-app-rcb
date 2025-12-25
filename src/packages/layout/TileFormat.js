import React from "react";
import FavoriteIcon from "../kloko/FavoriteIcon";
import { Card } from "react-bootstrap";
import { QRCode as QRCodeLogo } from "react-qrcode-logo";
import { Colors } from "../../styles/colors";
import Tracker from "../tracker/tracker";

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

const TileFormat = ({ data, onClick }) => {
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

  console.log("EVENT CARD", data);

  const size = 128,
    logoPadding = 4,
    logoWidth = 64,
    logoImage = "logo192.png",
    color = Colors.primary;

  const placeholderImage = (
    <div
      className="w-100 ratio ratio-9x16 d-flex align-items-center justify-content-center "
      style={{
        aspectRatio: "10 / 10",
        borderRadius: "0.5rem",
        backgroundColor: "black", //"#cf99cf",
        border: "5px solid greay", //"5px solid #e7cce7",
      }}
    ></div>
  );

  // Determine star icon
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
      <Tracker itemtype={data.tracker} id={data.id}>
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
                <div className="text-center" style={{ wdith: "50%" }}>
                  <QRCodeLogo
                    size={size}
                    value={`${link}`}
                    fgColor={color}
                    ecLevel="H"
                    logoPadding={logoPadding}
                    logoWidth={logoWidth}
                    logoPaddingStyle="circle" // square
                    // qrStyle="dots"
                    className="qrcode"
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
