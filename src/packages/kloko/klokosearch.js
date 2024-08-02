import React, { useState, useEffect } from "react";
import useSearch from "./usesearch";
import {
  Card,
  Button,
  Form,
  InputGroup,
  Row,
  Col,
  Image,
  Container,
} from "react-bootstrap";
import SelectLocationModal from "../gps/selectlocationmodal";
import KlokoImage from "./klokoimage";
import PlaceSearch from "./placesearch";
import { Search } from "react-bootstrap-icons";
import BookingSection from "./klokobookingsection";

function getTomorrow() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Function to get the day after tomorrow's date
function getTodayPlus(days) {
  const today = new Date();
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + days);
  const year = dayAfterTomorrow.getFullYear();
  const month = String(dayAfterTomorrow.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(dayAfterTomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const KlokoSearch = () => {
  const { searchResults, searchEventListing } = useSearch();
  const [lat, setLat] = useState(-26.06);
  const [lng, setLng] = useState(27.9);
  const [style, setStyle] = useState("Salsa");
  const [start, setStart] = useState(getTomorrow());
  const [end, setEnd] = useState(getTodayPlus(2));

  const onSearch = () => {
    searchEventListing(lat, lng, style, start, end);
  };

  const found = (place) => {
    setLat(place.lat);
    setLng(place.lon);
  };

  return (
    <div>
      <Row>
        <Col sm={12} md={3}>
          <InputGroup className="m-2">
            <InputGroup.Text>Location</InputGroup.Text>
            <PlaceSearch onFound={found} />
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col sm={12} md={3}>
          <InputGroup className="m-2">
            <InputGroup.Text>Style</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Style"
              value={style}
              onChange={(ev) => setStyle(ev.target.value)}
            />
          </InputGroup>
        </Col>
        <Col sm={12} md={3} className="m-2">
          <Row>
            <Col xs={6}>
              <InputGroup>
                <InputGroup.Text>Start</InputGroup.Text>
                <Form.Control
                  type="date"
                  placeholder="Start"
                  value={start}
                  onChange={(ev) => setStart(ev.target.value)}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Text>End</InputGroup.Text>
                <Form.Control
                  type="date"
                  placeholder="End"
                  value={end}
                  onChange={(ev) => setEnd(ev.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>
        <Col className="m-2 text-end">
          <Button onClick={onSearch}>Search</Button>
        </Col>
      </Row>

      <Container>
        {searchResults?.map((event) => {
          return (
            <Card key={event.id} className="p-3" style={{ border: "none" }}>
              <Row>
                <Col xs={12} md={3}>
                  <KlokoImage event={event} />
                </Col>
                <Col xs={12} md={9}>
                  <div>
                    <h3>
                      <a href="#">{event.title}</a>
                    </h3>
                  </div>
                  <div>
                    {event.firstname} {event.lastname}
                  </div>
                  <div>{event.description}</div>
                  <div>{event.start_time}</div>
                  <div>{event.end_time}</div>
                  <div>{event.style}</div>
                  <div>$ {event.price}</div>
                  <div>{Math.ceil(event.distance)} km</div>
                  <div>
                    Available: {event.max_participants - event.bookings} of{" "}
                    {event.max_participants}
                  </div>
                  <div>
                    {event.location} ({event.lat}, {event.lng})
                  </div>
                  <BookingSection event={event} />
                </Col>
              </Row>
              <div></div>
            </Card>
          );
        })}
      </Container>
    </div>
  );
};

export default KlokoSearch;
