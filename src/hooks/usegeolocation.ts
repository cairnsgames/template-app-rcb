import { useState, useEffect } from "react";

type OnChange = (coords: GeolocationCoordinates) => void;
type OnFoundPosition = (coords: [number, number]) => void;

const useGeoLocation = (onChange?: OnChange | null, live = false) => {
  const [latlng, setlatlng] = useState<GeolocationCoordinates>();

  const getPosition = (onFoundPosition?: OnFoundPosition) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setlatlng(position.coords);
          if (onChange) {
            onChange(position.coords);
          }
          if (onFoundPosition) {
            onFoundPosition([position.coords.latitude, position.coords.longitude]);
          }
        },
        (error) => {
          console.error("Error getting geolocation", error);
        }
      );
    } else {
      console.warn("No Geolocation available");
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      getPosition();
      if (live) {
        navigator.geolocation.watchPosition((position) => {
          setlatlng(position.coords);
          if (onChange) {
            onChange(position.coords);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { latlng, getPosition };
};

export default useGeoLocation;
