import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import useMapContext from "./context/usemapcontext";
import { Button, ButtonGroup } from "react-bootstrap";
import { Map, Pin } from "react-bootstrap-icons";
import Markers from "./markers";
import "leaflet/dist/leaflet.css";
import "./map.scss";
import MapEvents from "./mapevents";

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
  const setMap = (map) => {};
  return (
    <div>
      <div style={{ position: "relative", zIndex: "100" }}>
        <ButtonGroup className="m-3" style={{position:"relative", left:"50px"}}>
        <Button onClick={() => centerMapOnCurrentLocation()}>
          <Pin />
        </Button>
        <Button onClick={() => setLocation(-26.20227, 28.04363)}>
          <Map />
        </Button>

        <Button
          onClick={() => setLocation(-25.81625913702715, 27.462750728129443)}
        >
          <Map />
        </Button>
        </ButtonGroup>
      </div>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        whenCreated={setMap}
        style={{
          position: "absolute",
          top: "56px",
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
        <MapEvents onMapChange={props.onMapChange} />
        <Markers markers={markers} />
           
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
