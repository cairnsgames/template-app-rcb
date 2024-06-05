import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const HourDropdown = ({ title, selectedHour, handleHourChange }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>{title}</InputGroup.Text>
      <Form.Select value={selectedHour} onChange={handleHourChange}>
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}:00
          </option>
        ))}
      </Form.Select>
    </InputGroup>
  );
};

export default HourDropdown;
