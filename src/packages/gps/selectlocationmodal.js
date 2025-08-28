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

const SelectLocationModal = ({ onSelectLocation, onSelectAddress }) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState([26, 26]);
  const [center, setCenter] = useState([26, 26]);

  const [map, setMap] = useState(null);

  const [marker, setMarker] = useState();

  const markers = marker ? [marker] : [];

  const selectMapLocation = (e) => {
    const latlng = e.latlng || e;
    setPosition([latlng.lat.toFixed(3), latlng.lng.toFixed(3)]);
    setMarker({
      id: "NEWMARKER",
      lat: latlng.lat,
      lng: latlng.lng,
      category: "",
      subcategory: [],
      color: "blue",
    });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClick = (e) => {
    setPosition(e.latlng);
  };

  const selectLocation = () => {
    if (onSelectLocation) {
      if (marker) {
        onSelectLocation([marker.lat, marker.lng]);
      } else {
        onSelectLocation(position);
      }
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
      onSelectAddress(address);
    }
  }

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        <Map />
      </Button>
  <Modal show={show} onHide={handleClose} backdropClassName="custom-dark-backdrop">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Select Location</Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
            minHeight: "60vh",
          }}
        >
          <MapDisplay
            offsetTop="0px"
            markers={markers}
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
