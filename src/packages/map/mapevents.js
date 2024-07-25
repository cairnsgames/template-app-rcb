import { useMapEvents } from "react-leaflet";

const MapEvents = (props) => {
  const { onMapChange, onMapClick } = props;
  const map = useMapEvents({
    findMe: () => {
      map.locate();
    },
    locationfound: (location) => {
      console.log("location found:", location);
      if (onMapClick) {
        onMapClick(location.latitude, location.longitude);
      }
    },
    click: (location) => {
      console.log("location found:", location.latlng);
      if (onMapClick) {
        onMapClick(location.latlng.lat, location.latlng.lng);
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
    },
  });
  return null;
};

export default MapEvents;
