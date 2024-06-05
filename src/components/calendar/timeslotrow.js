import React from 'react';
import { Card } from 'react-bootstrap';

const TimeSlotRow = ({
  slotTime,
  appointmentSpan,
  isSelected,
  triggerSelectEvent,
  triggerSelectTime,
}) => {
  return (
    <tr
      onClick={() =>
        appointmentSpan
          ? triggerSelectEvent(appointmentSpan.appointment)
          : triggerSelectTime(slotTime)
      }
      style={{
        backgroundColor: isSelected ? "darkgrey" : "transparent",
        color: isSelected ? "white" : "black",
        cursor: "pointer",
        width: "100%",
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
              <Card.Title>{appointmentSpan.appointment.name}</Card.Title>
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
};

export default TimeSlotRow;
