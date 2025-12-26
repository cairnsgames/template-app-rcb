import React from "react";
import { useNews } from "../news/context/newscontext";
import NewsItem from "../news/newsitem";
import NewsThumb from "../news/newsthumb";
import "../news/news.scss";
import NewsCard from "../news/newscard";
import Tracker from "../tracker/tracker";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Card } from "react-bootstrap";
import LocationSearch from "../../external/LocationSearch";
import SearchFilterModal from "./SearchFilterModal";
import useEvents from "../kloko/context/useevents";
import EventThumb from "../kloko/eventthumb";
import EventItem from "../kloko/eventitem";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import useTenant from "../tenant/context/usetenant";
import useUser from "../auth/context/useuser";
import TilesLayout from "../layout/Tiles";
import Tile from "../layout/Tile";

const SearchDisplay = ({ item, onClick, layout }) => {
  if (layout === "card") {
    return <NewsCard item={item} onClick={onClick} />;
  }
  if (layout === "thumb") {
    return <NewsThumb item={item} onClick={onClick} />;
  }
  return (
    <Tracker itemtype="news.card" id={item.id}>
      <NewsItem key={item.id} item={item} onClick={onClick} />
    </Tracker>
  );
};

export const SearchItems = ({ count, layout, onClick }) => {
  const { newsItems } = useNews();
  const items = newsItems.slice(0, count);

  return (
    <>
      {items.map((item) => {
        return (
          <SearchDisplay
            key={item.id}
            item={item}
            layout={layout}
            onClick={onClick}
          />
        );
      })}
    </>
  );
};

const Partner = ({ item, index }) => {
  return (<Card className="partner-card" key={item.user_id+"-"+index}>    
    <Card.Header><h5>{item.firstname} {item.lastname}</h5></Card.Header>
    <Card.Body>
      
    {item.avatar && (
      <div className="partner-avatar">
        <img
          src={item.avatar}
          alt={item.firstname + item.lastname|| "Partner avatar"}
          style={{ maxWidth: "100%", height: "auto", display: "block", marginBottom: 8 }}
        />
      </div>
    )}
    {Array.isArray(item.offerings) && item.offerings.length > 0 ? (
        <div>
          <strong>Offerings:</strong>{" "}
          {item.offerings.map(o => (o && typeof o === "object" ? o.name : o)).filter(Boolean).join(", ")}
        </div>
      ) : null}
    
    </Card.Body>
    {Array.isArray(item.roles) && item.roles.length > 0 ? (
      <Card.Footer>
        <strong>Roles:</strong>{" "}
        {item.roles.map(r => (r && typeof r === "object" ? r.name : r)).filter(Boolean).join(", ")}
      </Card.Footer>
    ) : (
      <Card.Footer><strong>Roles:</strong> None</Card.Footer>
    )}
      
    <p><strong>Distance:</strong> {item.distance ? `${item.distance.toFixed(1)} km` : 'Unknown'}</p>
  </Card>);
}

const Search = ({ layout = "default", items = 99999 }) => {
  const { t } = useTranslation();
  const { newsItems, location, setLocation: setNewsLocation } = useNews();
  const { setLocation: setEventLocation } = useEvents();
  const { events } = useEvents();
  const { tenant } = useTenant();
  const { token } = useUser();

  const handleItemClick = (id) => {
    window.location.hash = `#news/${id}`;
  };

  const handleEventClick = (eventId) => {
    window.location.hash = `#events/${eventId}`;
  };

  const [partners, setPartners] = React.useState([]);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [selectedTypes, setSelectedTypes] = React.useState(new Set()); // 'news','event'
  const [selectedRoles, setSelectedRoles] = React.useState([]); // role ids

  React.useEffect(() => {
    const lat = location?.lat ?? location?.latitude ?? -26.096;
    const lng = location?.lon ?? location?.lng ?? location?.longitude ?? 28.009;
    const distance = location?.distance ?? 50;

    // fetchPartners is defined later in this component
    fetchPartners(lat, lng, distance);
  }, [location]);

  const fetchPartners = async (lat = -26.096, lng = 28.009, distance = 50) => {
    const url = combineUrlAndPath(
      process.env.REACT_APP_PARTNER_API,
      "api.php/localpartners"
    );

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          app_id: tenant,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lat, lng, distance }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Partner API error ${res.status} ${text}`);
      }

      console.log("fetchPartners response:", res);

      const json = await res.json();
      setPartners(Array.isArray(json) ? json : json.data || []);
      console.log("Partners:", json);
      return json;
    } catch (err) {
      console.error("fetchPartners failed:", err);
      return null;
    }
  };

  const toggleType = (type) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setSelectedTypes(next);
  };

  const toggleRole = (roleId) => {
    const idx = selectedRoles.indexOf(roleId);
    if (idx === -1) setSelectedRoles([...selectedRoles, roleId]);
    else setSelectedRoles(selectedRoles.filter((r) => r !== roleId));
    console.log("Toggled role:", roleId, selectedRoles);
  };

  // Filter out old events
  const filteredEvents = (events || []).filter((event) => {
    return (
      new Date(event.start_time) >= new Date() ||
      new Date(event.end_time) >= new Date()
    );
  });

  // Merge news and events with a type indicator
  const mergedItems = [
    ...(newsItems || []).map((item) => ({ ...item, itemType: "news" })),
    ...filteredEvents.map((event) => ({ ...event, itemType: "event" })),
    ...partners.map((partner) => ({ ...partner, itemType: "partner" })),
  ];

  // Apply filters (types and partner roles)
  const typeFilterActive = selectedTypes && selectedTypes.size > 0;
  const roleFilterActive = selectedRoles && selectedRoles.length > 0;

  const filteredMerged = mergedItems.filter((item) => {
    // If no filters are active, keep the item
    if (!typeFilterActive && !roleFilterActive) return true;

    // Handle partners
    if (item.itemType === "partner") {
      if (roleFilterActive) {
        const roles = Array.isArray(item.roles) ? item.roles : [];
        const roleIds = roles
          .map((r) => (r && typeof r === "object" ? r.id : Number(r)))
          .filter(Boolean);
        // require at least one overlap
        const overlap = selectedRoles.some((rid) => roleIds.includes(rid));
        return overlap;
      }
      // If only type filters are active (news/events) and no role filters, include partners
      if (typeFilterActive && !roleFilterActive) {
        // partners are neither 'news' nor 'event' so include partners when types are not restricting them
        return true;
      }
      // otherwise if some filter active but none matches, exclude
      return false;
    }

    // Handle news/events
    if (item.itemType === "news" || item.itemType === "event") {
      if (typeFilterActive) {
        return selectedTypes.has(item.itemType);
      }
      // If role filter is active but no type filter, exclude news/events
      if (roleFilterActive && !typeFilterActive) return false;
      return true;
    }

    return true;
  });

  // Sort by distance
  const sortedItems = filteredMerged
    .sort((a, b) => {
      const distanceA = a.distance ?? Infinity;
      const distanceB = b.distance ?? Infinity;
      return distanceA - distanceB;
    })
    .slice(0, items);

  const setLocation = (location) => {
    console.log("Search setting location:", location);
    setNewsLocation(location);
    setEventLocation(location);
  }

  return (
    <Tracker itemtype="news" id={"page"}>
      <div className="news">
        <Row className="mb-3 align-items-center">
          <Col xs={11} md={11} className="my-2">
            <LocationSearch onSelected={setLocation} />
          </Col>
          <Col xs={1} md={1} className="text-right">
            <Button variant="secondary" onClick={() => setShowFilterModal(true)} title="Filters">
              Filters
            </Button>
          </Col>
        </Row>

        <SearchFilterModal
          show={showFilterModal}
          onHide={() => setShowFilterModal(false)}
          selectedTypes={selectedTypes}
          toggleType={toggleType}
          selectedRoles={selectedRoles}
          toggleRole={toggleRole}
          clearFilters={() => {
            setSelectedTypes(new Set());
            setSelectedRoles([]);
          }}
        />
        <TilesLayout>
          {sortedItems.map((item, index) => {
            const distance =
              item.distance !== undefined && item.distance !== null
                ? `${item.distance.toFixed(1)}km`
                : "Unknown distance";

            switch (item.itemType) {
              case "event":
                return (
                  <Tile key={item.id}>
                    {item.itemType} {item.favorite}
                    <EventItem item={item}>
                      <EventThumb event={item} onClick={handleEventClick} />
                      <div className="text-muted small mb-3">
                        This Event is {distance} from you
                      </div>
                    </EventItem>
                  </Tile>
                );
              case "partner":
                return (
                  <Tile key={item.user_id+"-"+index}>
                    {item.itemType}
                    <Partner item={item} index={index} />
                    <div className="text-muted small mb-3">
                      This Partner is {distance} from you
                    </div>
                  </Tile>
                );
              default:
                return (
                  <Tile key={item.id}>
                    {item.itemType}
                    <SearchDisplay item={item} layout={layout} onClick={handleItemClick} />
                    <div className="text-muted small mb-3">
                      This {item.globalNews ? "GLOBAL News" : "News"} is {distance} from you
                    </div>
                  </Tile>
                );
            }
          })}
        </TilesLayout>
      </div>
    </Tracker>
  );
};

export default Search;
