import { useState, useEffect } from "react";
import { Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useDebounce } from "../../hooks/usedebounce";

export function PlaceSearch({ onFound }) {
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      getSuburbs(debouncedSearchTerm);
    } else {
      setPlaces([]);
      setShowTooltip(false);
    }
  }, [debouncedSearchTerm]);

  const getSuburbs = (name) => {
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=50&featureType=settlement&city=${name}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPlaces(data);
        setShowTooltip(true);
      });
  };

  const handlePlaceClick = (place) => {
    onFound(place);
    setShowTooltip(false);
  };

  return (
    <>
      <Form.Control
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <OverlayTrigger
        placement="bottom"
        show={showTooltip && places.length > 0}
        overlay={
          <Tooltip id="places-tooltip">
            <div className="places">
              {places.map((place) => (
                <div
                  key={place.place_id}
                  onClick={() => handlePlaceClick(place)}
                  style={{ cursor: "pointer" }}
                >
                  {place.display_name}
                </div>
              ))}
            </div>
          </Tooltip>
        }
      >
        <div style={{ height: "1px" }}></div>
      </OverlayTrigger>
    </>
  );
}

export default PlaceSearch;
