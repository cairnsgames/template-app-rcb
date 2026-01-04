import React, { useEffect, useState } from "react";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import useGeoLocation from "../../hooks/usegeolocation";
import useGPS from "../../packages/gps/usegps";

const GeoLocationPage = () => {
  const { latlng } = useGeoLocation();
  const { getLocationDetails } = useGPS();
  const [location, setLocation] = useState();

  useEffect(() => {
    const getLocation = async (lat, lng) => {
        const locationDetails = await getLocationDetails(-24.76198989176629, 25.858401339575014) ; //lat, lng);
        setLocation(locationDetails);
    }
    if (latlng) {
      getLocation(latlng.latitude, latlng.longitude);
    }
  }, [latlng]);

  return (    
    <PageCentered style={{ margin: "1rem" }} className="pagesGeoLocationPage">
        <h1>Geo Location Page</h1>
        <div style={{ padding: "1rem", border: "2px solid green", borderRadius: "2rem" }}>
          Your Current location is:
          <div>
            Lat {latlng?.latitude}, Lng {latlng?.longitude}
          </div>
          {location && (
            <div>
              City: {location.city}, State: {location.state}, Country: {location.country}
              </div>
          )}
        </div>
    </PageCentered>
  );
};

export default GeoLocationPage;
