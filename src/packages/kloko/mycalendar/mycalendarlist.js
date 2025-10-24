import { Card, Button, Container, Row, Col, Badge } from "react-bootstrap";
import {
  ChevronLeft,
  ChevronRight,
  SkipForwardFill,
  SkipBackwardFill,
  TicketPerforated,
  StarFill,
} from "react-bootstrap-icons";
import { useEvents } from "./mycalendarcontext";
import { useRef, useState, useEffect } from "react";

export const EventList = () => {
  const {
    currentDate,
    setCurrentDate,
    getEventsForDate,
    getNextEventDate,
    getPreviousEventDate,
  } = useEvents();

  const [pointerStartX, setPointerStartX] = useState(null);
  const [pointerCurrentX, setPointerCurrentX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMovedDuringDrag, setHasMovedDuringDrag] = useState(false);
  const [allowDrag, setAllowDrag] = useState(true);
  const [numColumns, setNumColumns] = useState(1);
  const containerRef = useRef(null);
  const dragRef = useRef({});

  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth;

      let columns = 1;
      if (width < 768) {
        columns = 1;
      } else if (width < 992) {
        columns = 3;
      } else if (width < 1400) {
        columns = 5;
      } else {
        columns = 7;
      }

  // allow drag on small/medium screens only (< 992)
  setAllowDrag(width < 992);

      setNumColumns(columns);
    };

    calculateColumns();
    window.addEventListener("resize", calculateColumns);
    return () => window.removeEventListener("resize", calculateColumns);
  }, []);

  const getDaysToShow = () => {
    const days = [];
    const middleIndex = Math.floor(numColumns / 2);

    for (let i = 0; i < numColumns; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + (i - middleIndex));
      days.push(date);
    }

    return days;
  };

  const daysToShow = getDaysToShow();

  const formatDate = (date, isColumn = false) => {
    if (isColumn) {
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    }
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatTime = (date) => {
    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleTimeString("en-US", options);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const goToPreviousEvent = () => {
    const prevDate = getPreviousEventDate(currentDate);
    if (prevDate) {
      setCurrentDate(prevDate);
    }
  };

  const goToNextEvent = () => {
    const nextDate = getNextEventDate(currentDate);
    if (nextDate) {
      setCurrentDate(nextDate);
    }
  };

  // Pointer/drag handlers to distinguish click vs drag and to move columns visually
  const onPointerDown = (e) => {
  if (!allowDrag) return;
    // Only left mouse button or touch
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const startX = e.clientX;
    setPointerStartX(startX);
    setPointerCurrentX(startX);
    setIsDragging(true);
    setHasMovedDuringDrag(false);
    dragRef.current = { startX, lastTranslate: 0 };
    // capture pointer to continue receiving events outside target
    if (containerRef.current) containerRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
  if (!allowDrag) return;
    if (!isDragging || pointerStartX === null) return;
    const currentX = e.clientX;
    setPointerCurrentX(currentX);
    const deltaX = currentX - pointerStartX;
    if (Math.abs(deltaX) > 5) setHasMovedDuringDrag(true);
  // no placeholder; just track movement
    // move the row visually by translating it horizontally
    const el = containerRef.current;
    if (el) {
      const translate = dragRef.current.lastTranslate = deltaX;
      el.style.transform = `translateX(${translate}px)`;
      el.style.transition = "transform 0s";
    }
  };

  const resetTranslate = (animate = true) => {
    const el = containerRef.current;
    if (!el) return;
    if (animate) el.style.transition = "transform 200ms ease";
    el.style.transform = "translateX(0px)";
    dragRef.current.lastTranslate = 0;
    // clear transition after it's done
    if (animate) {
      setTimeout(() => {
        if (el) el.style.transition = "";
      }, 250);
    }
  };

  const onPointerUp = (e) => {
  if (!allowDrag) return;
    if (!isDragging) return;
    const endX = e.clientX;
    const delta = (pointerStartX ?? endX) - endX;
    const threshold = 75; // pixels to count as swipe

    // release capture
    try {
      if (containerRef.current) containerRef.current.releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }


    // decide action (fix direction mapping):
    // drag left (negative translate) -> advance to next day
    // drag right (positive translate) -> go to previous day
    if (Math.abs(dragRef.current.lastTranslate) > threshold) {
      if (dragRef.current.lastTranslate < 0) {
        // dragged left -> next day
        goToNextDay();
      } else {
        // dragged right -> previous day
        goToPreviousDay();
      }
    }

    // reset visual transform
    resetTranslate(true);

  // no placeholder to clear

    setIsDragging(false);
    setPointerStartX(null);
    setPointerCurrentX(null);
    setHasMovedDuringDrag(false);
  };

  // Allow cards to participate in dragging: forward pointerdown to container
  const onCardPointerDown = (e) => {
    // don't stop propagation; instead, ensure the container's onPointerDown runs
    // If the container ref exists and the event originated inside the card, call the same logic
    // Note: we intentionally do not call e.stopPropagation() so the Row receives the event
    // but in some React synthetic event order, calling container handler explicitly keeps behavior consistent
    if (containerRef.current) {
      // create a minimal fake event for container handler if needed
      try {
        onPointerDown(e);
      } catch (err) {
        // ignore
      }
    }
  };

  // Click handler for card: show alert, but ignore if the user just dragged
  const onCardClick = (eventObj) => {
    // if user dragged, ignore click
    if (hasMovedDuringDrag) {
      // small debounce so that a subsequent click isn't triggered
      setHasMovedDuringDrag(false);
      return;
    }
    // show alert — replace with nicer UI if desired
    alert(`Event: ${eventObj.name}`);
  };

  const hasPreviousEvent = getPreviousEventDate(currentDate) !== null;
  const hasNextEvent = getNextEventDate(currentDate) !== null;

  return (
    <Container fluid className="py-4 h-100">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0 text-center flex-grow-1">
              {formatDate(currentDate)}
            </h2>
          </div>
          <div className="d-flex justify-content-center gap-2">
            <Button
              variant="outline-primary"
              onClick={goToPreviousEvent}
              disabled={!hasPreviousEvent}
            >
              <SkipBackwardFill />
            </Button>
            <Button variant="primary" onClick={goToPreviousDay}>
              <ChevronLeft className="me-1" />
              Previous Day
            </Button>
            <Button variant="primary" onClick={goToNextDay}>
              Next Day
              <ChevronRight className="ms-1" />
            </Button>
            <Button
              variant="outline-primary"
              onClick={goToNextEvent}
              disabled={!hasNextEvent}
            >
              <SkipForwardFill />
            </Button>
          </div>
        </Col>
      </Row>

      <Row
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="g-3"
        style={{ touchAction: "pan-y", minHeight: "60vh" }}
      >
  {/* placeholder removed */}

        {daysToShow.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCenterColumn = index === Math.floor(numColumns / 2);

          return (
            <Col
              key={day.toISOString()}
              style={{ flex: `1 1 ${100 / numColumns}%` }}
            >
              <div
                className={`h-100 ${
                  isCenterColumn
                    ? "border border-primary border-2 rounded p-2"
                    : ""
                }`}
              >
                <h5
                  className={`text-center mb-3 ${
                    isToday(day) ? "text-primary fw-bold" : ""
                  }`}
                >
                  {formatDate(day, true)}
                  {isToday(day) && (
                    <Badge bg="primary" className="ms-2">
                      Today
                    </Badge>
                  )}
                </h5>
                {dayEvents.length === 0 ? (
                  <Card className="text-center py-4 bg-light border-0">
                    <Card.Body>
                      <p className="text-muted mb-0 small">No events</p>
                    </Card.Body>
                  </Card>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {dayEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="shadow-sm"
                        style={{
                          borderColor:
                            event.type === "booked" ? "#000000" : "#8b5cf6",
                          borderWidth: "2px",
                        }}
                      >
                        <Card.Body
                          className="p-3 position-relative"
                          style={{ paddingRight: "2.5rem" }}
                          onPointerDown={onCardPointerDown}
                          onClick={() => onCardClick(event)}
                        >
                          <div
                            className="position-absolute"
                            style={{
                              color: "#8b5cf6",
                              top: "0.5rem",
                              right: "0.5rem",
                            }}
                          >
                            {event.type === "booked" ? (
                              <TicketPerforated size={20} />
                            ) : (
                              <StarFill size={20} />
                            )}
                          </div>
                          <Card.Title
                            className="mb-2 fs-6"
                            style={{ paddingRight: "1.5rem" }}
                          >
                            {event.name}
                          </Card.Title>
                          <div className="d-flex flex-column gap-1 small text-muted">
                            <span>
                              <strong>Start:</strong>{" "}
                              {formatTime(event.startTime)}
                            </span>
                            <span>
                              <strong>Duration:</strong>{" "}
                              {formatDuration(event.duration)}
                            </span>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          );
        })}

  {/* placeholder removed */}
      </Row>
    </Container>
  );
};
