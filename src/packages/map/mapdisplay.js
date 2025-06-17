import { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import useMapContext from "./context/usemapcontext";
import { Button, ButtonGroup, Row, Col } from "react-bootstrap";
import { Map, Pin, Search } from "react-bootstrap-icons";
import Markers from "./markers";
import "leaflet/dist/leaflet.css";
import "./map.scss";
import MapEvents from "./mapevents";
import MapSearch from "./mapSearch";
import Filter from "../../components/icons/filter";
import MapFilterModal from "./mapfilter";

import useGeoLocation from "../../hooks/usegeolocation";

function ChangeView({ center, zoom }) {
  const map = useMap();
  if (map) {
    // Only fly to the new view if the zoom level is different
    if (map.getZoom() !== zoom) {
      map.flyTo(center, zoom);
    }
  }
  return null;
}

const MapControls = (props) => {
  const [isSecondColBelow, setIsSecondColBelow] = useState(false);
  const [isMapSearchVisible, setIsMapSearchVisible] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const isModal = props.isModal ?? false;
  const { searchMapArea } = useMapContext();
  const map = useMap();

  
  const { getPosition } = useGeoLocation();

  const goToLocation = (lat, lng) => {
    map.flyTo([lat, lng], 15);
  };
  const goToCurrentLocation = async () => {
    getPosition((res) => {
      console.log("CURRENT POSITION", res);
      if (res) {
        map.flyTo([res[0], res[1]], 15);
      }
    });
  };

  return (
    <div style={{ position: "relative", zIndex: "1100" }}>
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
              <Button onClick={() => goToCurrentLocation()}>
                <Pin />
              </Button>
              <Button
                onClick={() =>
                  goToLocation(-25.81625913702715, 27.462750728129443)
                }
              >
                <Map />
              </Button>
              <Button
                onClick={() => setIsMapSearchVisible(!isMapSearchVisible)}
              >
                <Search />
              </Button>
              <Button onClick={() => setShowFilter(!showFilter)}>
                <Filter />
              </Button>
            </ButtonGroup>
          </Col>
          {!isModal && (
            <Col xs={12} className={isSecondColBelow ? "mt-3" : ""}>
              {isMapSearchVisible && (
                <MapSearch onClose={() => setIsMapSearchVisible(false)} />
              )}
              {showFilter && (
                <MapFilterModal
                  onHide={() => setShowFilter(false)}
                  show={showFilter}
                />
              )}
            </Col>
          )}
        </Row>
      </div>

      {isModal && isMapSearchVisible && <MapSearch />}
    </div>
  );
};

const MapDisplay = (props) => {
  const { center, zoom, searchMapArea, markers, onClick } =
    useMapContext();

  const mapRef = useRef(null);

  const handleMapLoad = () => {    
    const map = mapRef.current;
    if (map) {
      const bounds = map.getBounds(); // Get the initial bounds
      searchMapArea(bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast());
    }
  };

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

  const mapClick = (e) => {
    console.log("Map clicked at:", e.latlng);
    if (props.onClick) {
      props.onClick(e);
    }
  }

  return (
    <div>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        whenReady={(e) => {
          mapRef.current = e.target;
          handleMapLoad();
        }}
        onClick={mapClick} // Added onClick event
        style={{
          position: "absolute",
          top: props.offsetTop ?? "106px",
          bottom: "0",
          left: "0",
          right: "0",
          zIndex: "0",
        }}
      >
        <MapControls />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <ChangeView center={center} /> */}
        <MapEvents onMapChange={props.onMapChange} onMapClick={props.onClick} />

        <Markers markers={props.markers ?? markers} />
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
