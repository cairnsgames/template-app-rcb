import { useMapEvents } from "react-leaflet";
import { useContext, useRef } from "react";
import { MapContext } from "./context/mapprovider";

const MapEvents = (props) => {
  const { onMapChange, onMapClick } = props;
  const { searchMapArea } = useContext(MapContext);
  const map = useMapEvents({
    findMe: () => {
      map.locate();
    },
    locationfound: (location) => {
      if (onMapClick) {
        onMapClick(location.latitude, location.longitude);
      }
    },
    click: (location) => {
      console.log("Map click", location.latlng);
      if (onMapClick) {
        onMapClick([location.latlng.lat, location.latlng.lng]);
      }
    },
    moveend: () => {
      let bnds = map.getBounds();
      if (onMapChange) {
        onMapChange(
          bnds.getSouth(),
          bnds.getWest(),
          bnds.getNorth(),
          bnds.getEast()
        );
      }
      // Check if the bounds have changed before calling searchMapArea
      if (
        prevBounds.current.getSouth() !== bnds.getSouth() ||
        prevBounds.current.getWest() !== bnds.getWest() ||
        prevBounds.current.getNorth() !== bnds.getNorth() ||
        prevBounds.current.getEast() !== bnds.getEast()
      ) {
        searchMapArea(bnds.getSouth(), bnds.getWest(), bnds.getNorth(), bnds.getEast());
        prevBounds.current = bnds; // Update the previous bounds
      }
    },
  });

  const prevBounds = useRef(map.getBounds()); // Initialize ref here

  return null;
};

export default MapEvents;
