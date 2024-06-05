import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const SlotIntervalDropdown = ({
  slotIntervals,
  allowedIntervals,
  slotInterval,
  handleSlotChange,
}) => {
  const slotChange = (e) => {
    handleSlotChange(Number(e.target.value));
  };
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>Slot Interval</InputGroup.Text>
      <Form.Select value={slotInterval} onChange={slotChange}>
        {slotIntervals.map((interval) =>
          allowedIntervals.includes(interval.duration) ? (
            <option key={interval.duration} value={interval.duration}>
              {interval.name}
            </option>
          ) : null
        )}
      </Form.Select>
    </InputGroup>
  );
};

export default SlotIntervalDropdown;
