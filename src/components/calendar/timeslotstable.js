import React from 'react';
import { Table } from 'react-bootstrap';
import TimeSlotRow from './timeslotrow';

const TimeSlotsTable = ({
  timeSlots,
  appointmentSpans,
  selectedSlots,
  triggerSelectEvent,
  triggerSelectTime,
  formatTime,
}) => {
  return (
    <Table bordered>
      <tbody>
        {timeSlots.map((slot, index) => {
          const slotTime = formatTime(slot.hour, slot.minute);
          const appointmentSpan = appointmentSpans[slotTime];
          const isSelected = selectedSlots.includes(slotTime);
          return (
            <TimeSlotRow
              key={index}
              slotTime={slotTime}
              appointmentSpan={appointmentSpan}
              isSelected={isSelected}
              triggerSelectEvent={triggerSelectEvent}
              triggerSelectTime={triggerSelectTime}
            />
          );
        })}
      </tbody>
    </Table>
  );
};

export default TimeSlotsTable;
