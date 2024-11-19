import React, { useState, useEffect } from 'react';
import { Pencil, X } from 'react-bootstrap-icons';
import { Button, InputGroup, FormControl } from 'react-bootstrap';

const EditableHeader = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log("isEditing", isEditing);
  }, [isEditing]);

  const handleEditClick = () => {
    console.log("Edit clicked", value);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    onChange(e);
  };

  const handleStopEditing = () => {
    setIsEditing(false);
  };

  return (
    <div className="editable-header">
      {isEditing ? (
        <InputGroup className="m-2">
          <FormControl
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleStopEditing();
              }
            }}
            autoFocus
          />
          <Button variant="outline-secondary" onClick={handleStopEditing}><X /></Button>
        </InputGroup>
      ) : (
        <h3 className="text-secondary">
          <Button variant="secondary" onClick={handleEditClick} className="me-2"><Pencil size="1rem" /></Button>
          File: {value ? value : 'No file selected'}
        </h3>
      )}
    </div>
  );
};

export default EditableHeader;
