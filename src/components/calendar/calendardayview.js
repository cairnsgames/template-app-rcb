import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SlotIntervalDropdown from "./slotintervaldropdown";
import HourDropdown from "./hourdropdown";
import TimeSlotsTable from "./timeslotstable";

const CalendarDayView = ({
  appointments = [],
  selectEvent,
  selectTime,
  multiselect = false,
  selectedSlots,
  setSelectedSlots,
}) => {
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
          <SlotIntervalDropdown
            slotIntervals={slotIntervals}
            allowedIntervals={allowedIntervals}
            slotInterval={slotInterval}
            handleSlotChange={handleSlotChange}
          />
        </Col>
        <Col>
          <HourDropdown
            title="Start Hour"
            selectedHour={startHour}
            handleHourChange={handleStartHourChange}
          />
        </Col>
        <Col>
          <HourDropdown
            title="End Hour"
            selectedHour={endHour}
            handleHourChange={handleEndHourChange}
          />
        </Col>
      </Row>
      <TimeSlotsTable
        timeSlots={timeSlots}
        appointmentSpans={appointmentSpans}
        selectedSlots={selectedSlots}
        triggerSelectEvent={triggerSelectEvent}
        triggerSelectTime={triggerSelectTime}
        formatTime={formatTime}
      />
    </Container>
  );
};

export default CalendarDayView;
