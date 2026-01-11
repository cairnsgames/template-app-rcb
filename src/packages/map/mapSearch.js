import { useState, useEffect } from "react";
import { Form, Row, Col, InputGroup, CloseButton } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useDebounce } from "../../hooks/usedebounce";
import "./mapsearch.scss";
import useMapContext from "./context/usemapcontext";
import LocationSearch from "../../external/LocationSearch";

export function MapSearch(props) {
  const { gotoLocation } = props;
  
  const [searchTerm, setSearchTerm] = useState("");
  const { center, setCenter } = useMapContext();

  const selectSuburb = (place) => {
    console.log("BBBB Selected place:", place);
    setCenter([place.lat, place.lon]);
    gotoLocation(place.lat, place.lon);
  };

  return (
    <div className="mapsearch map-control" onClick={(e) => e.stopPropagation()}>
      <div style={{ width: "100%", display: "block" }}>
        <CloseButton
        className=""
          style={{ float: "right", marginTop: "0.5rem", zIndex: 2100 }}
          aria-label="Close map search"
          onClick={(e) => {
            e.stopPropagation();
            if (typeof props.onClose === "function") props.onClose();
          }}
        />
        <div
          style={{ display: "flex", alignItems: "center", padding: "0.5rem" }}
        >
          <LocationSearch onSelected={selectSuburb} />
        </div>
      </div>
    </div>
  );
}

export default MapSearch;
