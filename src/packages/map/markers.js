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
      {markers &&
        markers.map((marker, index) => {
          let cat = marker.subcategory.filter(Boolean).join(", ");
          if (cat === "") {
            cat = ["Partner"];
          }
          // Group IDs to check
          const specialGroupIds = [1, 2, 3, 4, 5, 6, 7, 22];

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
                        <div
                          className="me-1"
                          style={{ display: "inline-block" }}
                        >
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
                          style={{
                            backgroundColor: "lightGrey",
                            borderRadius: "10px",
                            border: "1px solid lightgray",
                          }}
                        >
                          {marker.title}
                        </div>
                      </div>
                      <div>
                        {marker.more && <FormattedText text={marker.more} />}
                        <div
                          style={{
                            textTransform: "capitalize",
                          }}
                        >
                          {cat}
                        </div>
                        {Array.isArray(marker.offerings) &&
                          marker.offerings.length > 0 && (
                            <div style={{
                            fontStyle: "italic",
                            textTransform: "capitalize",
                          }}>
                              <strong>Offerings:</strong>{" "}
                              {marker.offerings.map((off, i) => {
                                if (specialGroupIds.includes(off.group_id)) {
                                  return (
                                    <span key={off.item_id}>
                                      {off.group_name} - {off.item_name}
                                      {i < marker.offerings.length - 1
                                        ? ", "
                                        : ""}
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span key={off.item_id}>
                                      {off.item_name}
                                      {i < marker.offerings.length - 1
                                        ? ", "
                                        : ""}
                                    </span>
                                  );
                                }
                              })}
                            </div>
                          )}
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
