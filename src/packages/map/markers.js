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
      {markers && markers.map((marker, index) => {
        let cat = marker.subcategory.filter(Boolean).join(", ");
        if (cat === "") {
          cat = ["Partner"];
        }
        return (
          <Tracker key={marker.pinid} itemtype="map.pin" id={marker.id}>
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
                    {marker.image && (
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
                    )}
                    <div style={{ display: "inline-block" }}>
                      <div
                        className="h5 m-2 p-2"
                        style={{ backgroundColor: "lightGrey", borderRadius:"10px", border: "1px solid lightgray" }}
                        //
                        variant="light"
                        // onClick={() => {
                        //   alert(marker.title);
                        // }}
                      >
                        {marker.title}
                      </div>
                    </div>
                    <div>
                      {marker.more && <FormattedText text={marker.more} />}
                      <span style={{ fontStyle: "italic", textTransform: "capitalize" }}>
                      {cat}
                      </span>
                      {marker.keywords && (
                        <div>
                          <br />
                          <strong>Keywords:</strong> {marker.keywords}
                        </div>
                      )}
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
