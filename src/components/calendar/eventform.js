import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const EventForm = ({ maxDuration, time, date, onSaveDetails, templates }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '60',
    location: '',
  });

  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.name === selectedTemplate);
      if (template) {
        setFormData({
          name: template.name,
          description: template.description,
          duration: template.duration,
          location: template.location,
        });
      }
    }
  }, [selectedTemplate, templates]);

  const generateDurationOptions = () => {
    const options = [];
    for (let i = 15; i <= Number(maxDuration); i += 15) {
      const label = i !== 60 ? `${i} minutes` : `${i / 60} hour`;
      options.push(<option key={i} value={i}>{label}</option>);
    }
    return options;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.location) newErrors.location = 'Location is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      formData.time = time;
      formData.date = date;
      
      onSaveDetails(formData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="template" className="p-3" style={{border:"1px solid var(--bs-primary)", borderRadius: "10px"}}>
        <Form.Label><strong>Use a Template</strong></Form.Label>
        <Form.Control
          as="select"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <option value="">Select a template</option>
          {templates.map((template) => (
            <option key={template.name} value={template.name}>
              {template.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          isInvalid={!!errors.name}
        />
        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="duration">
        <Form.Label>Duration</Form.Label>
        <Form.Control
          as="select"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        >
          {generateDurationOptions()}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="location">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          isInvalid={!!errors.location}
        />
        <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="text"
          value={date}
          readOnly
        />
      </Form.Group>

      <Form.Group controlId="startTime">
        <Form.Label>Start Time</Form.Label>
        <Form.Control
          type="text"
          value={time}
          readOnly
        />
      </Form.Group>

      <Button type="submit">Save</Button>
    </Form>
  );
};

export default EventForm;