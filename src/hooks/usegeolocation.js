import React, { useState, useEffect } from "react";

const useGeoLocation = (onChange, live = false) => {
    const [latlng, setlatlng] = useState();

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
  }, []);

  const getPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setlatlng(position.coords);
        if (onChange) {
          onChange(position.coords);
        }
      });
    }
  };

  return { latlng, getPosition };
};

export default useGeoLocation;
