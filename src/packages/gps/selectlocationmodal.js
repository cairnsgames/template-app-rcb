import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Map } from "react-bootstrap-icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import MapDisplay from "../map/mapdisplay";
import "./selectlocationmodal.scss";

/*
# USAGE

  <SelectLocationModal onSelectLocation={selectLocation}/>

  const selectLocation = (position) => {
    setTeacherToEdit((teacher) => ({
      ...teacher,
      teacherlat: position.lat.toFixed(3),
      teacherlng: position.lng.toFixed(3),
    }));
  }
*/

const SelectLocationModal = ({ onSelectLocation, onSelectAddress, defaultStart }) => {
  const [show, setShow] = useState(false);
  const JOHANNESBURG_CBD = { lat: -26.2041, lng: 28.0473 };

  const initialStart = (defaultStart && defaultStart.lat !== undefined && defaultStart.lng !== undefined)
    ? [defaultStart.lat, defaultStart.lng]
    : [JOHANNESBURG_CBD.lat, JOHANNESBURG_CBD.lng];

  const [position, setPosition] = useState(initialStart);
  const [center, setCenter] = useState(initialStart);

  const [map, setMap] = useState(null);

  const [marker, setMarker] = useState();

  const markers = marker ? [marker] : [];

  const selectMapLocation = (e) => {
    console.log("CCCC ============ Map location selected:", e);
    const latlng = e.latlng || e;
    setPosition([latlng.lat.toFixed(3), latlng.lng.toFixed(3)]);
    const newMarker = {
      id: 0,
      pinid: "New"+Date.now(),
      lat: latlng.lat,
      lng: latlng.lng,
      category: "",
      subcategory: [],
      color: "blue",
    }
    console.log("CCCC Setting new marker:", newMarker);
    setMarker(newMarker);
    setPosition([latlng.lat, latlng.lng]);
    setCenter([latlng.lat, latlng.lng]);
    onSelectLocation(latlng);
  };

  useEffect(() => {
    // If no explicit defaultStart was provided, try to use current geolocation
    if (!defaultStart) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = [pos.coords.latitude, pos.coords.longitude];
            setCenter(coords);
            setPosition(coords);
          },
          (err) => {
            // Couldn't get geolocation; keep Johannesburg CBD as fallback (already set)
            console.warn("Geolocation unavailable, using fallback:", err);
          },
          { timeout: 5000 }
        );
      }
    }
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClick = (e) => {
    setPosition(e.latlng);
  };

  const selectLocation = () => {
    if (onSelectLocation) {
      // Always send object in { lat, lng, name } format
      const lat = marker ? marker.lat : Array.isArray(position) ? Number(position[0]) : (position && position.lat) ? Number(position.lat) : JOHANNESBURG_CBD.lat;
      const lng = marker ? marker.lng : Array.isArray(position) ? Number(position[1]) : (position && position.lng) ? Number(position.lng) : JOHANNESBURG_CBD.lng;
      const name = null; // name may be provided via onSelectAddress callback
      onSelectLocation({ lat, lng, name });
    }
    setShow(false);
  };

  const LocationFinder = () => {
    useMapEvents({
      click(e) {
        handleClick(e);
      },
    });
    return null;
  };

  const goHome = () => {
    map.flyTo([user.lat, user.lng]);
  };
  const goFound = (latlng) => {
    map.flyTo(latlng);
  };

  const goHere = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        map.flyTo([position.coords.latitude, position.coords.longitude]);
      });
    }
  };

  const setSelectedAddress = (address) => {
    if (onSelectAddress) {
      console.log("CCCC Selected address:", address);

      const name = address?.fullAddress || address?.display_name || `${address?.street || ""} ${address?.city || address?.town || address?.village || ""}`.trim();
      onSelectAddress({ lat: position.lat, lng: position.lng, name, ...address });
    }
  };

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        <Map />
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdropClassName="custom-dark-backdrop"
        contentClassName="select-location-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Select Location</Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          <MapDisplay
            offsetTop="0px"
            markers={markers}
            defaultStart={defaultStart}
            onClick={selectMapLocation}
            onAddressSelected={setSelectedAddress}
            isModal={true}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={selectLocation}>
            Select
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SelectLocationModal;
