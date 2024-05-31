import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Table,
  Card,
} from "react-bootstrap";

const CalendarDayView = ({ appointments = [], selectEvent, selectTime, multiselect = false, selectedSlots, setSelectedSlots }) => {
  const [slotInterval, setSlotInterval] = useState(30);
  const [startHour, setStartHour] = useState(8);
  const [endHour, setEndHour] = useState(17);
  const [allowedIntervals, setAllowedIntervals] = useState([15, 30, 60]);

  const slotIntervals = [
    { duration: 15, name: "15 minutes" },
    { duration: 30, name: "30 minutes" },
    { duration: 60, name: "1 hour" },
  ];

  useEffect(() => {
    const updateAllowedIntervals = () => {
      const starts = appointments.map((appointment) => {
        const [hour, minute] = appointment.startingTime.split(":").map(Number);
        return minute;
      });

      const newAllowedIntervals = slotIntervals.filter((interval) => {
        return starts.every((start) => start % interval.duration === 0);
      });

      const allowedDurations = newAllowedIntervals.map(
        (interval) => interval.duration
      );
      setAllowedIntervals(allowedDurations);

      if (!allowedDurations.includes(slotInterval)) {
        setSlotInterval(allowedDurations[0]);
      }
    };

    updateAllowedIntervals();
  }, [appointments]);

  const handleSlotChange = (interval) => {
    setSlotInterval(interval);
  };

  const handleStartHourChange = (hour) => {
    setStartHour(hour);
  };

  const handleEndHourChange = (hour) => {
    setEndHour(hour);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += Number(slotInterval)) {
        slots.push({ hour, minute });
      }
    }
    return slots;
  };

  const formatTime = (hour, minute) => {
    const h = hour.toString().padStart(2, "0");
    const m = minute.toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const getEventDurationInSlots = (duration) => {
    return Math.ceil(duration / slotInterval);
  };

  const timeSlots = generateTimeSlots();

  const triggerSelectEvent = (appointment) => {
    if (selectEvent) {
      selectEvent(appointment);
    }
  };

  const triggerSelectTime = (slotTime) => {
    setSelectedSlots((prev) => {
      const newSelection = prev.includes(slotTime)
        ? prev.filter((time) => time !== slotTime)
        : [...prev, slotTime];

      const calculateMaxDuration = (selectedSlots) => {
        return selectedSlots.reduce((minDuration, slot) => {
          const [hour, minute] = slot.split(":").map(Number);
          const slotStartTime = new Date();
          slotStartTime.setHours(hour, minute, 0, 0);

          let maxDuration = endHour * 60 - (hour * 60 + minute);
          for (const appointment of appointments) {
            const [appointmentHour, appointmentMinute] = appointment.startingTime
              .split(":")
              .map(Number);
            const appointmentStartTime = new Date();
            appointmentStartTime.setHours(appointmentHour, appointmentMinute, 0, 0);

            if (appointmentStartTime > slotStartTime) {
              maxDuration = (appointmentStartTime - slotStartTime) / (1000 * 60);
              break;
            }
          }

          return Math.min(minDuration, maxDuration);
        }, endHour * 60);
      };

      const maxDuration = calculateMaxDuration(newSelection);
      
      if (selectTime) {
        selectTime(newSelection, maxDuration);
      }

      return newSelection;
    });
  };

  const appointmentSpans = {};

  appointments.forEach((appointment) => {
    const [startHour, startMinute] = appointment.startingTime
      .split(":")
      .map(Number);
    const durationInSlots = getEventDurationInSlots(appointment.duration);

    let slotStart = new Date();
    slotStart.setHours(startHour, startMinute, 0, 0);

    for (let i = 0; i < durationInSlots; i++) {
      const slotHour = slotStart.getHours();
      const slotMinute = slotStart.getMinutes() + i * slotInterval;
      slotStart.setMinutes(slotMinute);

      const slotTime = formatTime(slotHour, slotMinute);
      appointmentSpans[slotTime] = {
        appointment,
        rowspan: i === 0 ? durationInSlots : 0,
      };
    }
  });

  return (
    <Container>
      <Row>
        <Col>
          <DropdownButton
            title="Slot Interval"
            onSelect={(e) => handleSlotChange(Number(e))}
          >
            {slotIntervals
              .filter((interval) =>
                allowedIntervals.includes(interval.duration)
              )
              .map((interval) => (
                <Dropdown.Item
                  key={interval.duration}
                  eventKey={interval.duration}
                  active={interval.duration === slotInterval}
                >
                  {interval.name}
                </Dropdown.Item>
              ))}
          </DropdownButton>
        </Col>
        <Col>
          <DropdownButton
            title="Start Hour"
            onSelect={(e) => handleStartHourChange(Number(e))}
          >
            {[...Array(24).keys()].map((hour) => (
              <Dropdown.Item key={hour} eventKey={hour}>
                {hour}:00
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
        <Col>
          <DropdownButton
            title="End Hour"
            onSelect={(e) => handleEndHourChange(Number(e))}
          >
            {[...Array(24).keys()].map((hour) => (
              <Dropdown.Item key={hour} eventKey={hour}>
                {hour}:00
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
      </Row>
      <Table bordered>
        <tbody>
          {timeSlots.map((slot, index) => {
            const slotTime = formatTime(slot.hour, slot.minute);
            const appointmentSpan = appointmentSpans[slotTime];
            const isSelected = selectedSlots.includes(slotTime);
            return (
              <tr
                key={index}
                onClick={() =>
                  appointmentSpan
                    ? triggerSelectEvent(appointmentSpan.appointment)
                    : triggerSelectTime(slotTime)
                }
                style={{
                  backgroundColor: isSelected ? "darkgrey" : "transparent",
                  color: isSelected ? "white" : "black",
                  cursor: "pointer",
                }}
              >
                <td
                  style={{
                    backgroundColor: isSelected ? "darkgrey" : "transparent",
                    color: isSelected ? "white" : "black",
                    cursor: "pointer",
                  }}
                >
                  {slotTime}
                </td>
                {appointmentSpan && appointmentSpan.rowspan > 0 ? (
                  <td
                    rowSpan={appointmentSpan.rowspan}
                    className="appointment"
                    style={{ height: "1px", padding: "5px" }}
                  >
                    <Card className="h-100 w-100">
                      <Card.Header>
                        <Card.Title>
                          {appointmentSpan.appointment.name}
                        </Card.Title>
                      </Card.Header>
                      <Card.Body className="d-flex align-items-center justify-content-center">
                        {appointmentSpan.appointment.name}
                      </Card.Body>
                    </Card>
                  </td>
                ) : !appointmentSpan ? (
                  <td
                    style={{
                      backgroundColor: isSelected ? "darkgrey" : "transparent",
                      color: isSelected ? "white" : "black",
                      cursor: "pointer",
                    }}
                  ></td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default CalendarDayView;
