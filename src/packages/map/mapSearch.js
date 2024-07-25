import { useState, useEffect } from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useDebounce } from "../../hooks/usedebounce";
import "./mapsearch.scss";
import useMapContext from "./context/usemapcontext";

export function MapSearch() {
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Example usage:
  const lat1 = 51.5074; // Latitude of London
  const lon1 = -0.1278; // Longitude of London
  const lat2 = 40.7128; // Latitude of New York
  const lon2 = -74.006; // Longitude of New York

  const distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
  console.log(`Distance: ${distance} km`);

  const [places, setPlaces] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { center, setCenter } = useMapContext();

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform the search operation with the debounced search term
      console.log("Searching for:", debouncedSearchTerm);
      getSuburbs(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const getSuburbs = (name) => {
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=50&featureType=settlement&city=${name}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPlaces(
          data
            .map((place) => {
              place.distance = getDistanceFromLatLonInKm(
                center[0],
                center[1],
                place.lat,
                place.lon
              );
              return place;
            })
            .sort((a, b) => a.distance - b.distance)
        );
      });
  };

  const goto = (place) => {
    setCenter([place.lat, place.lon]);
  };

  useEffect(() => {
    getSuburbs("Johannesburg");
  }, []);

  return (
    <div className="mapsearch">
        <div style={{width: "100%", display: "block"}}>
          <InputGroup className="mb-3">
            <InputGroup.Text>Search </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
          </InputGroup>
        </div>
      <div style={{width:"100%"}}>
          <div className="places">
            {places?.map((place) => (
              <div
                key={place.place_id}
                onClick={() => {
                  setCenter([place.lat, place.lon]);
                }}
              >
                <div
                  onClick={() => {
                    goto(place);
                  }}
                >
                  {place.display_name} {place.distance.toFixed(0)} km
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}

export default MapSearch;
