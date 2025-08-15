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
        </Row>
      </div>

      {!isModal && (
        <>
          {isMapSearchVisible && (
            <MapSearch onClose={() => setIsMapSearchVisible(false)} />
          )}
          {showFilter && (
            <MapFilterModal
              onHide={() => setShowFilter(false)}
              show={showFilter}
            />
          )}
        </>
      )}
      {isModal && isMapSearchVisible && <MapSearch />}
    </div>
  );
};

const AddressPanel = ({ address, isLoading }) => (
  <div
    style={{
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      padding: "10px",
      textAlign: "center",
      zIndex: "1100",
    }}
  >
    <span>{isLoading ? "Loading..." : address || "No location selected"}</span>
  </div>
);

const MapDisplay = (props) => {
  const { mustSelect = true, onMapChange, onMapClick } = props;
  const { center, zoom, searchMapArea, markers, onClick } = useMapContext();
  const [initialCenter, setInitialCenter] = useState(center); // State for initial center
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const mapRef = useRef(null);

  useEffect(() => {
    if (props.startAtMyLocation !== false && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setInitialCenter(newCenter);
          if (mapRef.current) {
            mapRef.current.setView(newCenter, zoom); // Ensure the map updates to the new center
          }
        },
        () => {
          console.warn("Unable to retrieve location. Using default center.");
        }
      );
    }
  }, [props.startAtMyLocation]);

  const handleMapLoad = () => {
    const map = mapRef.current;
    if (map) {
      const bounds = map.getBounds(); // Get the initial bounds
      searchMapArea(
        bounds.getSouth(),
        bounds.getWest(),
        bounds.getNorth(),
        bounds.getEast()
      );
    }
  };

  const mapClick = async (e) => {
    console.log("Map clicked event triggered", e); // Debugging log
    if (props.onClick) {
      props.onClick(e);
    }

    const { lat, lng } = e.latlng;
    console.log("Clicked location:", lat, lng); // Debugging log

    setIsLoading(true); // Show spinner while loading
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log("API response:", data); // Debugging log

      const formattedAddress = {
        street: data.address?.road || "Unknown Street",
        city:
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          "Unknown City",
        country: data.address?.country || "Unknown Country",
        fullAddress: data.display_name || "Address not found",
      };

      setSelectedAddress(formattedAddress.fullAddress);

      // Pass the formatted address to the modal or callback
      if (props.onAddressSelected) {
        props.onAddressSelected(formattedAddress);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setSelectedAddress("Error fetching address");
    } finally {
      setIsLoading(false); // Hide spinner after loading
    }
  };

  return (
    <div>
      <MapContainer
        center={initialCenter} // Use initialCenter state
        zoom={zoom}
        scrollWheelZoom={true}
        whenReady={(e) => {
          console.log("Map ready event triggered"); // Debugging log
          mapRef.current = e.target;
          handleMapLoad();
        }}
        onClick={(e) => {
          console.log("MapContainer onClick event", e); // Debugging log
          mapClick(e);
        }}
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
        <MapEvents
          onMapChange={props.onMapChange}
          onMapClick={(e) => {
            console.log("MapEvents onMapClick event", e); // Debugging log
            mapClick(e);
          }}
        />
        <Markers markers={props.markers ?? markers} />
      </MapContainer>
      {mustSelect && (
        <AddressPanel address={selectedAddress} isLoading={isLoading} />
      )}
    </div>
  );
};

MapDisplay.defaultProps = {
  startAtMyLocation: true, // Default value for the prop
};

export default MapDisplay;
