import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { useContext, useRef } from "react";
import { MapContext } from "./context/mapprovider";

const MapEvents = (props) => {
  const { onMapChange, onMapClick } = props;
  const { searchMapArea, setCenter, setZoom } = useContext(MapContext);
  const [firstLoad, setFirstLoad] = useState(true);

  const map = useMapEvents({
    findMe: () => {
      map.locate();
    },
    locationfound: (location) => {
      if (onMapClick) {
        onMapClick(location.latitude, location.longitude);
      }
    },
    moveend: () => {
      let bnds = map.getBounds();
      const center = map.getCenter();
      const zoom = map.getZoom();

      if (onMapChange) {
        onMapChange(
          bnds.getSouth(),
          bnds.getWest(),
          bnds.getNorth(),
          bnds.getEast()
        );
      }
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
    // load: () => {
    //   let bnds = map.getBounds();
    //   searchMapArea(bnds.getSouth(), bnds.getWest(), bnds.getNorth(), bnds.getEast());
    // },
  });

  const prevBounds = useRef(map.getBounds()); // Initialize ref here

  // map.whenReady(() => {
  //   if (firstLoad) {
  //     let bnds = map.getBounds();
  //     searchMapArea(bnds.getSouth(), bnds.getWest(), bnds.getNorth(), bnds.getEast());
  //     setFirstLoad(false);
  //   }
  // });

  return null;
};

export default MapEvents;
