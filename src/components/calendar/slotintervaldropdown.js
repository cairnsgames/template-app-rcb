import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const SlotIntervalDropdown = ({ slotIntervals, allowedIntervals, slotInterval, handleSlotChange }) => {
  return (
    <DropdownButton title="Slot Interval" onSelect={(e) => handleSlotChange(Number(e))}>
      {slotIntervals
        .filter((interval) => allowedIntervals.includes(interval.duration))
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
  );
};

export default SlotIntervalDropdown;
