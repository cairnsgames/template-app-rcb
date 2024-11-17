import { MapContainer, TileLayer, useMap } from "react-leaflet";
import useMapContext from "./context/usemapcontext";
import { Button, ButtonGroup, Row, Col } from "react-bootstrap";
import { Map, Pin, Search } from "react-bootstrap-icons";
import Markers from "./markers";
import "leaflet/dist/leaflet.css";
import "./map.scss";
import MapEvents from "./mapevents";
import MapSearch from "./mapSearch";
import { useEffect, useState } from "react";

function ChangeView({ center, zoom }) {
  const map = useMap();
  if (map) {
    map.flyTo(center, zoom);
  }
  return null;
}

const MapDisplay = (props) => {
  const { center, zoom, centerMapOnCurrentLocation, setLocation, markers } =
    useMapContext();
  const [isSecondColBelow, setIsSecondColBelow] = useState(false);
  const [isMapSearchVisible, setIsMapSearchVisible] = useState(false); // New state for MapSearch visibility

  const isModal = props.isModal ?? false;
  const setMap = (map) => {};

  useEffect(() => {
    const updateLayout = () => {
      const mapWrapper = document.querySelector(".mapwrapper");
      if (mapWrapper) {
        const width = mapWrapper.offsetWidth;
        setIsSecondColBelow(width < 500);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  return (
    <div>
      <div style={{ position: "relative", zIndex: "100" }}>
        <div
          className="mapwrapper"
          style={{
            position: "relative",
            left: "80px",
            width: "calc(100vw - 130px)",
            overflow: "hidden",
          }}
        >
          <Row>
            <Col xs={12} md={2}>
              <ButtonGroup className="m-3">
                <Button onClick={() => centerMapOnCurrentLocation()}>
                  <Pin />
                </Button>
                <Button
                  onClick={() =>
                    setLocation(-25.81625913702715, 27.462750728129443)
                  }
                >
                  <Map />
                </Button>
                <Button
                  onClick={() => setIsMapSearchVisible(!isMapSearchVisible)}
                >
                  {" "}
                  {/* Toggle visibility */}
                  <Search />
                </Button>
              </ButtonGroup>
            </Col>
            {!isModal && (
            <Col xs={12} className={isSecondColBelow ? "mt-3" : ""}>
              {isMapSearchVisible && (
                <MapSearch />)
              }
            </Col>)}
          </Row>
        </div>
        
        {isModal && isMapSearchVisible && (<MapSearch/>)}
      </div>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        whenCreated={setMap}
        onClick={props.onClick} // Added onClick event
        style={{
          position: "absolute",
          top: props.offsetTop ?? "106px",
          bottom: "0",
          left: "0",
          right: "0",
          zIndex: "0",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={zoom} />
        <MapEvents onMapChange={props.onMapChange} onMapClick={props.onClick} />

        <Markers markers={props.markers ?? markers} />
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
