import React, { useRef } from "react";
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
import PageCentered from "../../parts/pagelayouts/pagecentered";
import "./mycalendar.scss";

const MyCalendar = () => {
    const calendarRef = useRef(null);
  return (
    <PageCentered className="myCalendar" style={{height: "100%"}}>
      <FullCalendar
        style={{height: "100%"}}
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        
        slotMinTime="08:00"
        slotMaxTime="22:00"
        headerToolbar={{
          left: `title`,
          center: "",
          right: "prev,next,today",
        }}
      />
    </PageCentered>
  );
};

export default MyCalendar;
