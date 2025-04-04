import React from "react";
import { Card } from "react-bootstrap";
import { QRCode as QRCodeLogo } from "react-qrcode-logo";
import { Colors } from "../../styles/colors";
import Tracker from "../../packages/tracker/tracker";

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

const Tile = ({ data, onClick }) => {
  const {
    title,
    image,
    description,
    footer,
    overlayText = true,
    qrcode = false,
    raw = {},
  } = data;

  console.log("Tile", data);

  const link = "https://juzt.dance#ticket?event=" + raw?.event_id;

  const size = 128,
    logoPadding = 4,
    logoWidth = 64,
    logoImage = "favicon.png",
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

  return (
    <div className="tile-wrapper mb-4">
      <Tracker itemtype={data.tracker} id={data.id}>
        <Card className={data.type} onClick={() => onClick(data)}>
          {image ? (
            <Card.Img variant="top" src={image} alt={title} />
          ) : (
            placeholderImage
          )}
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

export default Tile;
