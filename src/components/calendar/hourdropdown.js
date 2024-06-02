import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const HourDropdown = ({ title, selectedHour, handleHourChange }) => {
  return (
    <DropdownButton title={title} onSelect={(e) => handleHourChange(Number(e))}>
      {[...Array(24).keys()].map((hour) => (
        <Dropdown.Item key={hour} eventKey={hour} active={hour === selectedHour}>
          {hour}:00
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default HourDropdown;
