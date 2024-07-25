import { useCallback } from "react";
import { useState, createContext, useEffect, useMemo } from "react";
import useGeoLocation from "../../../hooks/usegeolocation";

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [center, setCenter] = useState([-26.20227, 28.04363]);
  const [zoom, setZoom] = useState(14);
  const { latlng } = useGeoLocation();
  const [markers, setMarkers] = useState([
    {
      lat: -26.207,
      lng: 28.04363,
      category: "default",
      title: "This Person",
      color: "blue",      
    },
    {
      lat: -26.20,
      lng: 28.04363,
      category: "default",
      title: "This Person",
      color: "orange",      
      more: "This is additional text about the pin.\n\nAnd can be formatted."
    },
    {
      lat: -26.19227,
      lng: 28.05,
      category: "default",
      title: "Other Person",
      color: "red",      
    },
    {
      lat: -26.18227,
      lng: 28.05,
      category: "default",
      title: "Other Person",
      color: "red",      
    },
    {
      lat: -25.81625913702715, 
      lng: 27.462750728129443,
      category: "default",
      title: "Another Person",
      color: "green",
    }
  ]);

  const centerMap = useCallback((lat, lng) => {
      setCenter([lat, lng]);
  }, [latlng])

  const centerMapOnCurrentLocation = useCallback(() => {
    if (latlng) {
      setCenter([latlng.latitude, latlng.longitude]);
    }
  }, [latlng])

  const setLocation = useCallback((lat, lng) => {
    setCenter([lat, lng]);
  }, [])

  const addMarker = (lat, lng, title) => {
    setMarkers([...markers, { lat, lng, title }]);
  };

  const values = useMemo(
    () => ({
      center, setCenter, zoom, centerMapOnCurrentLocation, setLocation, markers, setMarkers, addMarker, centerMap
    }),
    [center, setCenter, zoom, centerMapOnCurrentLocation, setLocation, markers, setMarkers, addMarker, centerMap]
  );

  return (
    <MapContext.Provider value={values}>
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
