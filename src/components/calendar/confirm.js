import React from 'react';
import Card from 'react-bootstrap/Card';

const Confirm = ({ formData }) => {
  const options1 = { year: '2-digit', month: '2-digit', day: '2-digit' };

  return (
    <div>
      <h1>Confirm</h1>
      <strong>The following events will be created:</strong>
      {formData?.time?.map((time, index) => {
        return (
          <Card key={index} style={{ marginBottom: '20px' }}>
            <Card.Header>{formData.name}</Card.Header>
            <Card.Body>
              <Card.Text><strong>Date and Time:</strong> {formData.date.toLocaleString(undefined, options1)} {time}</Card.Text>
              <Card.Text><strong>Description:</strong> {formData.description}</Card.Text>
              <Card.Text><strong>Location:</strong> {formData.location}</Card.Text>
              <Card.Text><strong>Duration:</strong> {formData.duration}</Card.Text>
              <Card.Text><strong>Max Participants:</strong> {formData.participants}</Card.Text>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default Confirm;
