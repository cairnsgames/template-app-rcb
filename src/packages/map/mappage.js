import MapDisplay from "./mapdisplay";
import Tracker from "../tracker/tracker";

const MapPage = () => {
  return (
    <Tracker itemtype="map" id={"page"}>
      <div>
        <MapDisplay />
      </div>
    </Tracker>
  );
};

export default MapPage;
