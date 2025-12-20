import React, { useState, useEffect, Suspense } from "react";
import {
  Button,
  DropdownButton,
  Dropdown,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import EventThumb from "./eventthumb"; // Assuming there's a component for displaying event thumbnails
import LoadingSpinner from "../../components/spinner/spinner";
import useMyEvents from "./context/usemyevents";
import Tracker from "../tracker/tracker";
import { useTranslation } from "react-i18next";

const KlokoEventEditor = React.lazy(() => import("./klokoevent"));

const KlokoMyEvents = () => {
  const { t } = useTranslation();
  const { myEvents, fetchEvents, loading } = useMyEvents();
  const [showEditor, setShowEditor] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [sortOption, setSortOption] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showOldEvents, setShowOldEvents] = useState(false);

  const handleAdd = () => {
    setEditItemId(null);
    setShowEditor(true);
  };

  const handleEdit = (id) => {
    setEditItemId(id);
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
  };

  const handleSort = (option) => {
    if (sortOption === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortOrder("asc");
    }
  };

  const sortedEvents = myEvents.sort((a, b) => {
    const compareValue = sortOrder === "asc" ? 1 : -1;

    if (sortOption === "title") {
      return a.title.localeCompare(b.title) * compareValue;
    } else if (sortOption === "start_time") {
      return (new Date(a.start_time) - new Date(b.start_time)) * compareValue;
    }
    return 0;
  });

  const filteredEvents = sortedEvents.filter(
    (event) => showOldEvents || new Date(event.end_time) >= new Date()
  );

  if (loading) {
    return (
      <div>
        <LoadingSpinner animation="border" />
      </div>
    );
  }

  return (
    <Tracker itemtype="partner.events" id={"events"}>
      <div className="my-events">
        {showEditor && (
          <Suspense fallback={<div>{t('events.loading')}</div>}>
            <KlokoEventEditor id={editItemId} onClose={handleEditorClose} />
          </Suspense>
        )}

        {!showEditor && (
          <>
            <Row className="mb-3">
              <Col xs={6} lg={3}>
                <Button variant="primary" onClick={handleAdd}>
                  {t('events.addEvent')}
                </Button>
              </Col>
              <Col xs={6} lg={3}>
                <DropdownButton
                  id="sort-dropdown"
                  title={t('events.sort')}
                  onSelect={handleSort}
                >
                  <Dropdown.Item eventKey="title">{t('events.title')}</Dropdown.Item>
                  <Dropdown.Item eventKey="start_time">{t('events.startTime')}</Dropdown.Item>
                </DropdownButton>
              </Col>
              <Col>
                <Form.Check
                  type="checkbox"
                  label={t('events.showOldEvents')}
                  checked={showOldEvents}
                  onChange={() => setShowOldEvents(!showOldEvents)}
                />
              </Col>
            </Row>
            <Row className="mx-1">
              {filteredEvents.map((event) => (
                <EventThumb
                  key={event.id}
                  event={event}
                  onClick={() => handleEdit(event.id)}
                  onEdit={() => handleEdit(event.id)}
                />
              ))}
            </Row>
          </>
        )}
      </div>
    </Tracker>
  );
};

export default KlokoMyEvents;
