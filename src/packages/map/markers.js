import { Marker, Popup } from "react-leaflet";
import { Button, Image } from "react-bootstrap";
import { getRequiredSVGPinByCategory } from "./pinfunctions";
import MarkerClusterGroup from "react-leaflet-cluster";
import FormattedText from "../utilities/formattedtext";

const Markers = ({ markers }) => {
  return (
    <MarkerClusterGroup chunkedLoading maxClusterRadius={30} showCoverageOnHover={false}>
      {markers.map((marker, index) => {
        return (
          <Marker
            key={index}
            position={[marker.lat, marker.lng]}
            icon={getRequiredSVGPinByCategory(marker.category, {
              fill: marker.color,
            })}
          >
            <Popup offset={[0, -30]}  autoPan={false}>
            
              <div>
                <div className="me-1" style={{ display: "inline-block" }}>
                  <Image roundedCircle src={marker.image ?? "person1.jpeg"} width="40px" />
                </div>
                <div style={{ display: "inline-block" }}>
                  <Button
                    variant="light"
                    onClick={() => {
                      alert(marker.title);
                    }}
                  >
                    {marker.title}
                  </Button>
                </div>
                <div>
                {marker.more && (<FormattedText text={marker.more} />)}
                {marker.category}, {marker.event_type}, {marker.keywords}<br/>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}{" "}
    </MarkerClusterGroup>
  );
};

export default Markers;
