import { Marker, Popup } from "react-leaflet";
import { Button, Image } from "react-bootstrap";
import { getRequiredSVGPinByCategory } from "./pinfunctions";
import MarkerClusterGroup from "react-leaflet-cluster";
import FormattedText from "../utilities/formattedtext";
import Tracker from "../tracker/tracker";

const Markers = ({ markers }) => {
  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={30}
      showCoverageOnHover={false}
    >
      {markers.map((marker, index) => {
        console.log("Marker", marker);
        return (
          <Tracker key={marker.id} itemtype="map.pin" id={marker.id}>            
            <Marker
              key={index}
              position={[marker.lat, marker.lng]}
              icon={getRequiredSVGPinByCategory(marker.category, {
                fill: marker.color,
              })}
            >
              <Popup offset={[0, -30]} autoPan={false}>
                <Tracker itemtype="map.popup" id={marker.id}>
                  <div>
                    <div className="me-1" style={{ display: "inline-block" }}>
                      <Image
                        roundedCircle
                        src={marker.image ?? "person1.jpeg"}
                        width="40px"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
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
                      {marker.more && <FormattedText text={marker.more} />}
                      {marker.category},{" "}
                      {marker.subcategory?.length > 0
                        ? marker.subcategory[0]
                        : "none"}
                      , {marker.keywords}
                      <br />
                    </div>
                  </div>
                </Tracker>
              </Popup>
            </Marker>
          </Tracker>
        );
      })}{" "}
    </MarkerClusterGroup>
  );
};

export default Markers;
