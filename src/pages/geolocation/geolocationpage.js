import PageCentered from "../../parts/pagelayouts/pagecentered";
import useGeoLocation from "../../hooks/usegeolocation";

const GeoLocationPage = () => {
  const { latlng } = useGeoLocation();
  return (
    <PageCentered style={{ margin: "1rem" }}>
        <h1>Geo Location Page</h1>
        <div style={{ padding: "1rem", border: "2px solid green", borderRadius: "2rem" }}>
          Your Current location is:
          <div>
            Lat {latlng?.latitude}, Lng {latlng?.longitude}
          </div>
        </div>
    </PageCentered>
  );
};

export default GeoLocationPage;
