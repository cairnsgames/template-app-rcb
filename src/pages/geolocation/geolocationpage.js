import PageWrapper from "../../parts/pagewrapper";
import useGeoLocation from "../../hooks/usegeolocation";

const GeoLocationPage = ({ id }) => {
  const { latlng } = useGeoLocation();
  return (
    <PageWrapper style={{ margin: "1rem" }}>
        <h1>Geo Location Page</h1>
        <div style={{ padding: "1rem", border: "2px solid green", borderRadius: "2rem" }}>
          Your Current location is:
          <div>
            Lat {latlng?.latitude}, Lng {latlng?.longitude}
          </div>
        </div>
    </PageWrapper>
  );
};

export default GeoLocationPage;
