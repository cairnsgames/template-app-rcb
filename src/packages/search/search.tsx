import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Tracker from "../tracker/tracker";
import LocationSearch from "../../external/LocationSearch";
import SearchFilterModal from "./SearchFilterModal";
import EventItem from "../kloko/eventitem";
import { useSearch } from "./context/searchcontext";
import Filter from "../../components/icons/filter";
import TilesLayout from "../layout/Tiles";
import Tile from "../layout/Tile";
import SearchDisplay from "./components/SearchDisplay";
import { SearchItems } from "./components/SearchItems";
import Partner from "./components/Partner";
import type { SearchPageProps, SearchResultItem } from "./search.types";

import "../news/news.scss";

type LocationSearchProps = {
  onSelected: (location: SearchPageProps extends never ? never : import("./search.types").SearchLocation | null) => void;
};

const TypedLocationSearch = LocationSearch as React.ComponentType<LocationSearchProps>;

const Search: React.FC<SearchPageProps> = ({ layout = "default", items = 99999 }) => {
  const { t } = useTranslation();
  const {
    selectedTypes,
    selectedRoles,
    toggleType,
    toggleRole,
    setSelectedTypes,
    setSelectedRoles,
    tempTypes,
    tempLocation,
    setTempLocation,
    tempPartnerRoles,
    tempFromDate,
    setTempFromDate,
    tempToDate,
    setTempToDate,
    toggleTempType,
    toggleTempPartnerRole,
    dateSelectorVisible,
    submitInitialSearch,
    applyLocation,
    sortedItems,
    showResults,
    setShowResults,
  } = useSearch();

  const handleItemClick = (id: number | string) => {
    window.location.hash = `#news/${id}`;
  };

  const handleEventClick = (eventId: number | string) => {
    window.location.hash = `#events/${eventId}`;
  };

  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const todayStr = new Date().toISOString().slice(0, 10);
  const [noResultsWidth, setNoResultsWidth] = React.useState("40vw");

  React.useEffect(() => {
    const updateWidth = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      if (width >= 992) setNoResultsWidth("40vw");
      else if (width >= 768) setNoResultsWidth("70vw");
      else setNoResultsWidth("95vw");
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <Tracker itemtype="page" id="news" itemid="news">
      <div className="news">
        {!showResults ? (
          <Card className="p-3 mb-3">
            <h4>{t("Search")}</h4>
            <Row className="mb-2">
              <Col>
                <TypedLocationSearch onSelected={setTempLocation} />
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
                      checked={tempTypes.has(type as "news" | "event" | "class")}
                      onChange={() => toggleTempType(type as "news" | "event" | "class")}
                      className="mr-3"
                    />
                  ))}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2">
              <Form.Label>
                <strong>Partner Roles:</strong>
              </Form.Label>
              <div>
                {[
                  { id: 26, label: "Teacher" },
                  { id: 27, label: "DJ" },
                  { id: 28, label: "Venue" },
                  { id: 29, label: "Event Coordinator" },
                  { id: 30, label: "Supplier" },
                ].map((role) => (
                  <Form.Check
                    inline
                    key={`role-${role.id}`}
                    id={`role-${role.id}`}
                    type="checkbox"
                    label={role.label}
                    checked={tempPartnerRoles.has(role.id)}
                    onChange={() => toggleTempPartnerRole(role.id)}
                    className="mr-3"
                  />
                ))}
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
                    onChange={(event) => setTempFromDate(event.target.value)}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={6} controlId="search-to">
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    type="date"
                    value={tempToDate}
                    min={tempFromDate || todayStr}
                    onChange={(event) => setTempToDate(event.target.value)}
                  />
                </Form.Group>
              </Row>
            )}

            <Row>
              <Col>
                <Button
                  onClick={submitInitialSearch}
                  disabled={
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
                <TypedLocationSearch onSelected={applyLocation} />
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

            {sortedItems.length === 0 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Card className="p-3 mb-3 text-center" style={{ width: noResultsWidth }}>
                  <h5>{t("No results found")}</h5>
                  <p className="mb-2">{t("No items match your search filters.")}</p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSelectedTypes(new Set());
                      setSelectedRoles([]);
                    }}
                  >
                    {t("Clear filters")}
                  </Button>
                </Card>
              </div>
            ) : (
              <TilesLayout>
                {sortedItems.slice(0, items).map((item: SearchResultItem, index: number) => {
                  const distance =
                    item.distance !== undefined && item.distance !== null
                      ? `${item.distance.toFixed(1)}km`
                      : "Unknown distance";

                  switch (item.itemType) {
                    case "event":
                      return (
                        <Tile key={item.id}>
                          <EventItem item={item} onClick={handleEventClick} />
                          <div className="text-muted small mb-3">This Event is {distance} from you</div>
                        </Tile>
                      );
                    case "class":
                      return (
                        <Tile key={`class-${item.id}`}>
                          <EventItem item={item} onClick={handleEventClick} />
                          <div className="text-muted small mb-3">This Class is {distance} from you</div>
                        </Tile>
                      );
                    case "partner":
                      return (
                        <Tile key={`${item.user_id ?? item.id}-${index}`}>
                          <Partner item={item} index={index} />
                          <div className="text-muted small mb-3">This Partner is {distance} from you</div>
                        </Tile>
                      );
                    default:
                      return (
                        <Tile key={item.id}>
                          <SearchDisplay item={item} layout={layout} onClick={handleItemClick} />
                          <div className="text-muted small mb-3">
                            This {item.globalNews ? "GLOBAL News" : "News"} is {distance} from you
                          </div>
                        </Tile>
                      );
                  }
                })}
              </TilesLayout>
            )}
          </>
        )}
      </div>
    </Tracker>
  );
};

export default Search;
