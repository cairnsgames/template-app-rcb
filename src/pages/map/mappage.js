import useMapContext from "../../packages/map/context/usemapcontext";
import MapDisplay from "../../packages/map/mapdisplay";
import { useGPS } from "../../packages/gps/usegps";

const Map = () => {
  const { markers, addMarker } = useMapContext();
  const { getLocationDetails } = useGPS();
  const mapChanged = (south, west, north, east) => {
  };
  const mapClick = async (lat, lng) => {
    // const details = await getLocationDetails(lat, lng);
    addMarker(lat, lng, details.suburb ?? details.city);
  };
  return (
      <MapDisplay onMapChange={mapChanged} onMapClick={mapClick} />
  );
};

export default Map;
