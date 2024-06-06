import React, { useState } from 'react';
import { Modal, Button, ListGroup, Form } from 'react-bootstrap';
import { Gear, PencilSquare, Trash } from 'react-bootstrap-icons';

const TemplateModal = ({ templates, setTemplates }) => {
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState('list'); // 'list' or 'form'
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    duration: '',
    location: '',
    participants: '10'
  });

  const handleClose = () => {
    setShowModal(false);
    setFormMode('list');
  };

  const handleShow = () => setShowModal(true);

  const handleEdit = (id) => {
    const templateToEdit = templates.find(template => template.id === id);
    setFormData(templateToEdit);
    setFormMode('form');
  };

  const handleDelete = (id) => {
    const updatedTemplates = templates.filter(template => template.id !== id);
    setTemplates(updatedTemplates);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (formData.id) {
      const updatedTemplates = templates.map(template =>
        template.id === formData.id ? formData : template
      );
      setTemplates(updatedTemplates);
    } else {
      setTemplates(prevTemplates => [...prevTemplates, { ...formData, id: Date.now() }]);
    }

    // Switch back to list mode and reset form data
    setFormMode('list');
    setFormData({
      id: '',
      name: '',
      description: '',
      duration: '',
      location: '',
      participants: '10'
    });
  };

  const handleBack = () => {
    setFormMode('list');
    // Reset form data
    setFormData({
      id: '',
      name: '',
      description: '',
      duration: '',
      location: '',
      participants: '10'
    });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <Gear /> 
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formMode === 'list' ? "Modify Templates" : "Edit Template"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formMode === 'list' ? (
            <ListGroup>
            {templates.map(template => (
              <ListGroup.Item key={template.id} className="d-flex justify-content-between align-items-center">
                <span>{template.name}</span>
                <div>
                  <Button variant="outline-info" onClick={() => handleEdit(template.id)}><PencilSquare /></Button>
                  <Button variant="outline-danger" onClick={() => handleDelete(template.id)}><Trash /></Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          ) : (
            <Form>
              <Form.Group controlId="formTemplateName">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter template name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formTemplateDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Enter template description" 
                  name="description" 
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formTemplateDuration">
                <Form.Label>Duration</Form.Label>
                <Form.Control 
                  as="select" 
                  name="duration" 
                  value={formData.duration}
                  onChange={handleChange}
                >
                  <option value="">Select duration</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">90 minutes</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formTemplateLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter template location" 
                  name="location" 
                  value={formData.location}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formTemplateParticipants">
                <Form.Label>Participants</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Enter number of participants" 
                  name="participants" 
                  value={formData.participants ?? 10}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={formMode === 'list' ? handleClose : handleBack}>
            {formMode === 'list' ? "Close" : "Back"}
          </Button>
          {formMode === 'list' ? (
            <Button variant="primary" onClick={() => setFormMode('form')}>Add</Button>
          ) : (
            <Button variant="primary" onClick={handleSave}>Save</Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TemplateModal;
