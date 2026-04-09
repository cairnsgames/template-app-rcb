import MapDisplay from "./mapdisplay";
import Tracker from "../tracker/tracker";

const MapPage = () => {
  return (
    <Tracker itemtype="page" id={"map"}>
      <div>
        <MapDisplay />
      </div>
    </Tracker>
  );
};

export default MapPage;
