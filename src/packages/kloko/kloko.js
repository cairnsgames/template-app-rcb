import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import {
  Row,
  Col,
  CloseButton,
  Form,
  Strong,
  InputGroup,
} from "react-bootstrap";

import "./kloko.scss";
import EventDetailsModal from "./eventdetailsmodal";
import useMyEvents from "./context/usemyevents";
import KlokoSearch from "./klokosearch";

function addMinutes(dateString, mins = 90) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }
  date.setTime(date.getTime() + mins * 60 * 1000);
  return date.toISOString();
}
function extractHourAndMinute(isoString) {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
function createId() {
  return Math.random().toString(36).substring(2, 9);
}

const Calendar = (props) => {
  const calendarRef = useRef(null);
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [calendarView, setCalendarView] = useState("timeGridWeek");
  const [duration, setDuration] = useState(60);
  const [showDetails, setShowDetails] = useState(false);
  const [newEvents, setNewEvents] = useState([]);
  const { myEvents, deleteEvent } = useMyEvents();
  const [nevents, setEvents] = useState([]);

  const setView = (event) => {
    let view = "timeGridDay";
    if (event.target.value === "Weekdays") {
      view = "timeGridWeek";
      setWeekendsVisible(false);
    }
    if (event.target.value === "Week") {
      view = "timeGridWeek";
      setWeekendsVisible(true);
    }
    if (event.target.value === "Month") view = "dayGridMonth";
    setCalendarView(view);
    let calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(view);
  };
  const handleDateClick = (arg) => {
    const end = addMinutes(arg.dateStr, duration);
    setNewEvents([
      ...newEvents,
      {
        id: createId(),
        title: "New Event",
        description: "",
        start: arg.dateStr,
        end: end,
        location: "",
        keywords: "",
        event_type: "",
        lat: "",
        lng: "",
        price: "",
        max_participants: 0,
        backgroundColor: "purple",
        extendedProps: { state: "new" },
      },
    ]);
  };
  const handleEventClick = (arg) => {};
  const saveEvents = (myEventsToAdd) => {
    setEvents([...myEvents, ...eventsToAdd]);
    setNewEvents([]);
    setShowDetails(false);
  };
  const removeEvent = (id) => {
    deleteEvent(id);
    setNewEvents(newEvents.filter((event) => event.id !== id));
  };
  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <div style={{ fontSize: "0.7rem" }}>
          {extractHourAndMinute(eventInfo.event.start)}
        </div>
        <div>{eventInfo.event.title}</div>
        <CloseButton
          variant="white"
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            height: "0.5rem",
          }}
          onClick={() => removeEvent(eventInfo.event.id)}
        />
      </div>
    );
  };

  const buttons = {};
  if (newEvents.length > 0) {
    buttons["Save"] = {
      text: "Save",
      click: () => {
        setShowDetails(true);
      },
    };
    buttons["Cancel"] = {
      text: "Cancel",
      click: () => {
        setEvents([...myEvents, ...newEvents]);
        setNewEvents([]);
      },
    };
  }

  const eventsToDisplay = [...(events ?? []), ...(newEvents ?? [])];
  return (
    <>
      <Row className="m-2">
        <Col xs={12}>
          <h1 class="text-center">Schedule Classes</h1>
        </Col>
        {/* <Col>
          <Form.Select onChange={setView} style={{fontSize:"10px"}}>
            <option value="Day">Day</option>
            <option value="Weekdays">Week</option>
            <option value="Week">Week with Weekends</option>
            <option value="Month">Month</option>
          </Form.Select>
        </Col> */}
        <Col>
          <InputGroup>
            <InputGroup.Text style={{fontSize:"10px"}}>Duration</InputGroup.Text>

            <Form.Select
              value={duration}
              onChange={(e) => setDuration(e.target.value)} style={{fontSize:"10px"}}
            >
              <option value="30">30 Minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1 hour 30 min</option>
              <option value="120">2 hour</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek" //"timeGridDay" //
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={eventsToDisplay}
        weekends={weekendsVisible}
        eventContent={renderEventContent}
        customButtons={buttons}
        slotMinTime="08:00"
        slotMaxTime="22:00"
        allDaySlot={false}
        headerToolbar={{
          left: `prev,next,today`,
          center: `${newEvents.length > 0 ? "Save,Cancel" : ""}`,
          right: "timeGridWeek,timeGridDay,listWeek",
        }}  
        expandRows={true}
        stickyHeaderDates={true}
        height={"auto"}
      />
      {showDetails && (
        <EventDetailsModal
          events={newEvents}
          onSave={saveEvents}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default Calendar;
