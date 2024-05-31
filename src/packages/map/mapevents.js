import { useMapEvents } from 'react-leaflet'

const MapEvents = (props) => {
    const { onMapChange } = props;
    const map = useMapEvents({
      click: () => {
        map.locate()
      },
      locationfound: (location) => {
        console.log('location found:', location)
      },
      moveend: () => {
		let bnds = map.getBounds();
        if (onMapChange) {
            onMapChange(bnds.getSouth(), bnds.getWest(), bnds.getNorth(), bnds.getEast());
        }
      },
    })
    return null
  }

export default MapEvents;