import useMapContext from "../../packages/map/context/usemapcontext";
import MapDisplay from "../../packages/map/mapdisplay";

const Map = () => {
  const { markers } = useMapContext();
  const mapChanged = (south, west, north, east) => {
    console.log("Map changed", south, west, north, east);
  }
  return (
    <MapDisplay onMapChange={mapChanged} />
  );
};

export default Map;
