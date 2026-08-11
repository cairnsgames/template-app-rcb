import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Map } from "react-bootstrap-icons";
import { useMapEvents } from "react-leaflet";
import MapDisplay from "../map/mapdisplay";
import "./selectlocationmodal.scss";

type LatLng = { lat: number; lng: number };
type Position = [number, number] | LatLng;

type MapMarker = {
  id: number;
  pinid: string;
  lat: number;
  lng: number;
  category: string;
  subcategory: string[];
  color: string;
};

type SelectedLocation = { lat: number; lng: number; name: string | null };

type SelectLocationModalProps = {
  onSelectLocation?: (location: SelectedLocation) => void;
  onSelectAddress?: (address: Record<string, unknown> & SelectedLocation) => void;
  defaultStart?: LatLng;
};

const JOHANNESBURG_CBD: LatLng = { lat: -26.2041, lng: 28.0473 };

const SelectLocationModal = ({ onSelectLocation, onSelectAddress, defaultStart }: SelectLocationModalProps) => {
  const [show, setShow] = useState(false);

  const initialStart: [number, number] =
    defaultStart?.lat !== undefined && defaultStart?.lng !== undefined
      ? [defaultStart.lat, defaultStart.lng]
      : [JOHANNESBURG_CBD.lat, JOHANNESBURG_CBD.lng];

  const [position, setPosition] = useState<Position>(initialStart);
  const [center, setCenter] = useState<[number, number]>(initialStart);
  const [map, setMap] = useState<{ flyTo: (coords: [number, number]) => void } | null>(null);
  const [marker, setMarker] = useState<MapMarker | undefined>(undefined);

  const markers = marker ? [marker] : [];

  const selectMapLocation = (e: { latlng?: LatLng } & LatLng) => {
    const latlng = e.latlng || e;
    const newMarker: MapMarker = {
      id: 0,
      pinid: "New" + Date.now(),
      lat: latlng.lat,
      lng: latlng.lng,
      category: "",
      subcategory: [],
      color: "blue",
    };
    setMarker(newMarker);
    setPosition([latlng.lat, latlng.lng]);
    setCenter([latlng.lat, latlng.lng]);
    if (onSelectLocation) onSelectLocation({ lat: latlng.lat, lng: latlng.lng, name: null });
  };

  useEffect(() => {
    if (!defaultStart) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            setCenter(coords);
            setPosition(coords);
          },
          (err) => {
            console.warn("Geolocation unavailable, using fallback:", err);
          },
          { timeout: 5000 }
        );
      }
    }
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClick = (e: { latlng: LatLng }) => {
    setPosition(e.latlng);
  };

  const selectLocation = () => {
    if (onSelectLocation) {
      const lat = marker
        ? marker.lat
        : Array.isArray(position)
          ? Number(position[0])
          : (position as LatLng).lat ?? JOHANNESBURG_CBD.lat;
      const lng = marker
        ? marker.lng
        : Array.isArray(position)
          ? Number(position[1])
          : (position as LatLng).lng ?? JOHANNESBURG_CBD.lng;
      onSelectLocation({ lat, lng, name: null });
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

  const goHere = () => {
    if ("geolocation" in navigator && map) {
      navigator.geolocation.getCurrentPosition((pos) => {
        map.flyTo([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  };

  const setSelectedAddress = (address: Record<string, unknown>) => {
    if (onSelectAddress) {
      const pos = position as LatLng;
      const name =
        (address.fullAddress as string) ||
        (address.display_name as string) ||
        `${(address.street as string) || ""} ${(address.city as string) || (address.town as string) || (address.village as string) || ""}`.trim();
      onSelectAddress({ lat: pos.lat, lng: pos.lng, name, ...address });
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
        <Modal.Body style={{ position: "relative", width: "100%" }}>
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
