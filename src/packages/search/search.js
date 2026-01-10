import React from "react";
import { useNews } from "../news/context/newscontext";
import NewsItem from "../news/newsitem";
import NewsThumb from "../news/newsthumb";
import "../news/news.scss";
import NewsCard from "../news/newscard";
import Tracker from "../tracker/tracker";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import LocationSearch from "../../external/LocationSearch";
import SearchFilterModal from "./SearchFilterModal";
import { useUser } from "../auth/context/useuser";
import useEvents from "../kloko/context/useevents";
import EventItem from "../kloko/eventitem";
import { usePartner } from "../partner/context/partnercontext";
import Filter from "../../components/icons/filter";
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
  const handleActivate = () => {
    const id = item.user_id ?? item.id;
    if (id !== undefined && id !== null) {
      window.location.hash = `#partner/${id}`;
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  };

  return (
    <Card
      className="partner-card"
      key={item.user_id + "-" + index}
      onClick={handleActivate}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      style={{ cursor: "pointer" }}
    >
      <Card.Header>
        <h5>
          {item.firstname} {item.lastname}
        </h5>
      </Card.Header>
      <Card.Body>
        {item.avatar && (
          <div className="partner-avatar">
            <img
              src={item.avatar}
              alt={item.firstname + item.lastname || "Partner avatar"}
              style={{
                maxWidth: "100%",
                height: "auto",
                display: "block",
                marginBottom: 8,
              }}
            />
          </div>
        )}
        {Array.isArray(item.offerings) && item.offerings.length > 0 ? (
          <div>
            <strong>Offerings:</strong>{" "}
            {item.offerings
              .map((o) => (o && typeof o === "object" ? o.name : o))
              .filter(Boolean)
              .join(", ")}
          </div>
        ) : null}
      </Card.Body>
      {Array.isArray(item.roles) && item.roles.length > 0 ? (
        <Card.Footer>
          <strong>Roles:</strong>{" "}
          {item.roles
            .map((r) => (r && typeof r === "object" ? r.name : r))
            .filter(Boolean)
            .join(", ")}
        </Card.Footer>
      ) : (
        <Card.Footer>
          <strong>Roles:</strong> None
        </Card.Footer>
      )}

      <p>
        <strong>Distance:</strong>{" "}
        {item.distance ? `${item.distance.toFixed(1)} km` : "Unknown"}
      </p>
    </Card>
  );
};
 

const Search = ({ layout = "default", items = 99999 }) => {
  const { t } = useTranslation();
  const { defaultLocation } = useUser();
  const { newsItems, location, setLocation: setNewsLocation } = useNews();
  const { setLocation: setEventLocation, classes, events } = useEvents();
  const { partners, setLocation: setPartnerLocation } = usePartner();

  const handleItemClick = (id) => {
    window.location.hash = `#news/${id}`;
  };

  const handleEventClick = (eventId) => {
    console.log("Click on Event", eventId);
    window.location.hash = `#events/${eventId}`;
  };

  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [selectedTypes, setSelectedTypes] = React.useState(new Set()); // 'news','event'
  const [selectedRoles, setSelectedRoles] = React.useState([]); // role ids
  // Known partner role ids (kept in sync with SearchFilterModal.PARTNER_ROLES)
  const PARTNER_ROLE_IDS = [26, 27, 28, 29, 30];

  const toggleRole = (roleId) => {
    const current = Array.isArray(selectedRoles) ? [...selectedRoles] : [];
    const has = current.includes(roleId);

    if (roleId === "ALL_PARTNERS") {
      if (!has) {
        // Select ALL and ensure all individual role ids are selected too
        const next = Array.from(new Set(["ALL_PARTNERS", ...current, ...PARTNER_ROLE_IDS]));
        setSelectedRoles(next);
      } else {
        // Unselect ALL and remove individual role ids as well
        const next = current.filter((r) => r !== "ALL_PARTNERS" && !PARTNER_ROLE_IDS.includes(r));
        setSelectedRoles(next);
      }
      return;
    }

    if (!has) {
      // add this role
      const next = Array.from(new Set([...current, roleId]));
      // if all individual roles selected, add ALL_PARTNERS
      const allPresent = PARTNER_ROLE_IDS.every((id) => next.includes(id));
      if (allPresent && !next.includes("ALL_PARTNERS")) next.push("ALL_PARTNERS");
      setSelectedRoles(next);
    } else {
      // remove this role and clear ALL_PARTNERS if present
      const next = current.filter((r) => r !== roleId && r !== "ALL_PARTNERS");
      setSelectedRoles(next);
    }
    console.log("Toggled role:", roleId, selectedRoles);
  };

  const toggleType = (type) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setSelectedTypes(next);
  };

  // Local state for initial search form
  const [showResults, setShowResults] = React.useState(false);
  const [tempTypes, setTempTypes] = React.useState(new Set());
  const [tempLocation, setTempLocation] = React.useState(null);
  const [tempPartnerRoles, setTempPartnerRoles] = React.useState(new Set());
  const [tempFromDate, setTempFromDate] = React.useState("");
  const [tempToDate, setTempToDate] = React.useState("");

  const [dateFrom, setDateFrom] = React.useState(null);
  const [dateTo, setDateTo] = React.useState(null);

  const toggleTempType = (type) => {
    const next = new Set(tempTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setTempTypes(next);
  };

  const toggleTempPartnerRole = (roleId) => {
    const next = new Set(tempPartnerRoles);
    if (next.has(roleId)) next.delete(roleId);
    else next.add(roleId);
    setTempPartnerRoles(next);
  };

  // Whether the date selectors should be shown (only for events or classes)
  const dateSelectorVisible = tempTypes && (tempTypes.has("event") || tempTypes.has("class"));

  // Filter out old events
  const filteredEvents = (events || []).filter((event) => {
    const now = new Date();
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    // remove events that are fully in the past
    if (end < now && start < now) return false;
    // apply date range filters if present
    if (dateFrom && end < dateFrom) return false;
    if (dateTo && start > dateTo) return false;
    return true;
  });

  // Filter out old classes (separate endpoint returns classes)
  const filteredClasses = (classes || []).filter((ev) => {
    const now = new Date();
    const start = new Date(ev.start_time);
    const end = new Date(ev.end_time);
    if (end < now && start < now) return false;
    if (dateFrom && end < dateFrom) return false;
    if (dateTo && start > dateTo) return false;
    return true;
  });

  // Merge news and events with a type indicator
  const mergedItems = [
    ...(newsItems || []).map((item) => ({ ...item, itemType: "news" })),
    ...filteredEvents.map((event) => ({ ...event, itemType: "event" })),
    ...filteredClasses.map((event) => ({ ...event, itemType: "class" })),
    ...partners.map((partner) => ({ ...partner, itemType: "partner" })),
  ];

  console.log("XXXX CLasses:", classes);
  console.log("XXXX Filtered Classes:", filteredClasses);

  // Apply filters (types and partner roles)
  const typeFilterActive = selectedTypes && selectedTypes.size > 0;
  const roleFilterActive = selectedRoles && selectedRoles.length > 0;

  const filteredMerged = mergedItems.filter((item) => {
    // If no filters are active, keep the item
    if (!typeFilterActive && !roleFilterActive) return true;

    // Handle partners
    if (item.itemType === "partner") {
      if (roleFilterActive) {
        // If the special ALL_PARTNERS sentinel is selected, include all partners
        if (selectedRoles.includes && selectedRoles.includes("ALL_PARTNERS")) {
          return true;
        }
        const roles = Array.isArray(item.roles) ? item.roles : [];
        const roleIds = roles
          .map((r) => (r && typeof r === "object" ? r.id : Number(r)))
          .filter(Boolean);
        // require at least one overlap
        const overlap = selectedRoles.some((rid) => roleIds.includes(rid));
        return overlap;
      }
      // If only type filters are active (news/events) and no role filters, exclude partners
      // (When the user explicitly filters to news/events they typically do not want partners.)
      if (typeFilterActive && !roleFilterActive) {
        return false;
      }
      // otherwise if some filter active but none matches, exclude
      return false;
    }

    // Handle news/events/classes
    if (
      item.itemType === "news" ||
      item.itemType === "event" ||
      item.itemType === "class"
    ) {
      if (typeFilterActive) {
        // If filtering by news type, allow news only if selected
        if (item.itemType === "news") return selectedTypes.has("news");

        // If item is explicitly a class, respect class selection
        if (item.itemType === "class") return selectedTypes.has("class");

        // For events, respect the event/class selections (some events may be classes)
        if (item.itemType === "event") {
          const et = (item.event_type || "").toString().toLowerCase();
          const isClass = et === "class";
          if (isClass) return selectedTypes.has("class");
          return selectedTypes.has("event");
        }
        return false;
      }
      // If role filter is active but no type filter, exclude news/events/classes
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

  const applyLocation = (location) => {
    console.log("YYYY Applying location to all contexts:", location);
    setNewsLocation(location);
    setEventLocation(location);
    setPartnerLocation(location);
  };

  const submitInitialSearch = () => {
    // require at least one category selected before showing results
    // allow search if either types or partner roles are selected
    if ((!tempTypes || tempTypes.size === 0) && (!tempPartnerRoles || tempPartnerRoles.size === 0)) return;
    // apply the temp selection to the main filters
    setSelectedTypes(new Set(tempTypes));
    if (tempLocation) applyLocation(tempLocation);
    else if (defaultLocation) applyLocation(defaultLocation);
    // map temp partner role keys (26,28,30) into selectedRoles
    if (tempPartnerRoles && tempPartnerRoles.size > 0) {
      setSelectedRoles(Array.from(tempPartnerRoles));
    }

    // Set date filters if provided
    if (tempFromDate) setDateFrom(new Date(tempFromDate));
    else setDateFrom(null);
    if (tempToDate) setDateTo(new Date(tempToDate));
    else setDateTo(null);

    setShowResults(true);
  };

  const todayStr = new Date().toISOString().slice(0, 10);


  return (
    <Tracker itemtype="news" id={"page"}>
      <div className="news">
        {!showResults ? (
          <Card className="p-3 mb-3">
            <h4>{t("Search")}</h4>
            <Row className="mb-2">
              <Col>
                <LocationSearch onSelected={setTempLocation} />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <Form.Group>
                  {["news", "event", "class"].map((type) => (
                    <Form.Check
                      inline
                      key={`type-${type}`}
                      id={`type-${type}`}
                      type="checkbox"
                      label={type.charAt(0).toUpperCase() + type.slice(1)}
                      checked={tempTypes.has(type)}
                      onChange={() => toggleTempType(type)}
                      className="mr-3"
                    />
                  ))}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2">
              <Form.Label><strong>Partner Roles:</strong></Form.Label>
              <div>
                <Form.Check
                  inline
                  id="role-26"
                  type="checkbox"
                  label="Teacher"
                  checked={tempPartnerRoles.has(26)}
                  onChange={() => toggleTempPartnerRole(26)}
                  className="mr-3"
                />
                <Form.Check
                  inline
                  id="role-28"
                  type="checkbox"
                  label="Venue"
                  checked={tempPartnerRoles.has(28)}
                  onChange={() => toggleTempPartnerRole(28)}
                  className="mr-3"
                />
                <Form.Check
                  inline
                  id="role-30"
                  type="checkbox"
                  label="Supplier"
                  checked={tempPartnerRoles.has(30)}
                  onChange={() => toggleTempPartnerRole(30)}
                />
              </div>
            </Form.Group>

            

            {dateSelectorVisible && (
              <Row className="mb-2">
                <Form.Group as={Col} xs={12} sm={6} controlId="search-from">
                  <Form.Label>From</Form.Label>
                  <Form.Control
                    type="date"
                    value={tempFromDate}
                    min={todayStr}
                    onChange={(e) => setTempFromDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} controlId="search-to">
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    type="date"
                    value={tempToDate}
                    min={tempFromDate || todayStr}
                    onChange={(e) => setTempToDate(e.target.value)}
                  />
                </Form.Group>
              </Row>
            )}

            <Row>
              <Col>
                <Button
                  onClick={submitInitialSearch}
                  disabled={
                    // disabled unless a type or a partner role is selected
                    ((!tempTypes || tempTypes.size === 0) && (!tempPartnerRoles || tempPartnerRoles.size === 0)) ||
                    (dateSelectorVisible && tempFromDate && new Date(tempFromDate) < new Date(todayStr))
                  }
                >
                  {t("Search")}
                </Button>
              </Col>
            </Row>
          </Card>
        ) : (
          <>
            <Row className="mb-3 align-items-center">
              <Col xs={8} sm={10} md={11} className="my-2">
                <LocationSearch onSelected={applyLocation} />
              </Col>
              <Col xs={4} sm={2} md={1} className="text-right">
                <Button
                  variant="outline-primary"
                  onClick={() => setShowFilterModal(true)}
                  title="Filters"
                  style={{ float: "right" }}
                >
                  <Filter />
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
                        <EventItem item={item} onClick={handleEventClick} />
                        <div className="text-muted small mb-3">
                          This Event is {distance} from you
                        </div>
                      </Tile>
                    );
                  case "class":
                    return (
                      <Tile key={"class-" + item.id}>
                        <EventItem item={item} onClick={handleEventClick} />
                        <div className="text-muted small mb-3">
                          This Class is {distance} from you
                        </div>
                      </Tile>
                    );
                  case "partner":
                    return (
                      <Tile key={item.user_id + "-" + index}>
                        <Partner item={item} index={index} />
                        <div className="text-muted small mb-3">
                          This Partner is {distance} from you
                        </div>
                      </Tile>
                    );
                  default:
                    return (
                      <Tile key={item.id}>
                        <SearchDisplay
                          item={item}
                          layout={layout}
                          onClick={handleItemClick}
                        />
                        <div className="text-muted small mb-3">
                          This {item.globalNews ? "GLOBAL News" : "News"} is{" "}
                          {distance} from you
                        </div>
                      </Tile>
                    );
                }
              })}
            </TilesLayout>
          </>
        )}
      </div>
    </Tracker>
  );
};

export default Search;
