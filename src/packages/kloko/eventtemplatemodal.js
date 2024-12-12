import React, { useState } from "react";
import { Button, Modal, Form, InputGroup, Spinner } from "react-bootstrap";
import { useTemplates } from "./context/usetemplates";
import useFileLoader from "../content/usefileloader";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import useUser from "../auth/context/useuser";

const EventTemplateModal = ({ show, onHide, onAddTemplate }) => {
  const { user } = useUser();
  const [newTemplate, setNewTemplate] = useState({
    title: 'Template',
    description: 'Description',
    duration: 60,
    location: '123',
    lat: null,
    lng: null,
    max_participants: 8,
    price: 30,
    event_type: 'Salsa',
    image: ''
  });

  const { fileData, fileInputRef, loading, fileSelected, uploadFile, isFileSelected } = useFileLoader("EVENT", handleFileUploadSuccess, handleFileUploadError);

  const handleFileUploadSuccess = (response) => {
    const fileName = response.filename;
    setNewTemplate({ ...newTemplate, image: fileName });
    return fileName;
  };

  const handleFileUploadError = () => {
    console.error("File upload failed");
  };

  const handleAddTemplate = async () => {
    const tempTemplate = { ...newTemplate }; // Create a temporary object
    if (isFileSelected) {
      const uploadedFile = await uploadFile(fileInputRef.current.files);
      tempTemplate.image = uploadedFile.filename;
    }
    onAddTemplate({ ...tempTemplate, user_id: user.id }); // Use the temporary object
    onHide();
    setNewTemplate({
      title: '',
      description: '',
      duration: 60,
      location: null,
      lat: null,
      lng: null,
      max_participants: 10,
      price: null,
      event_type: '',
      image: ''
    });
  }

  return (
    <Modal show={show} onHide={onHide} scrollable>
      <Modal.Header>
        <Modal.Title>Add New Template</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Text>Title</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Template Title"
              value={newTemplate.title}
              onChange={(ev) =>
                setNewTemplate({ ...newTemplate, title: ev.target.value })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Description</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Template Description"
              value={newTemplate.description}
              onChange={(ev) =>
                setNewTemplate({ ...newTemplate, description: ev.target.value })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Duration</InputGroup.Text>
            <Form.Control
              type="number"
              value={newTemplate.duration}
              onChange={(ev) =>
                setNewTemplate({ ...newTemplate, duration: ev.target.value })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Location</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Location"
              value={newTemplate.location}
              onChange={(ev) =>
                setNewTemplate({ ...newTemplate, location: ev.target.value })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Max Participants</InputGroup.Text>
            <Form.Control
              type="number"
              value={newTemplate.max_participants}
              onChange={(ev) =>
                setNewTemplate({ ...newTemplate, max_participants: ev.target.value })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Price (US$)</InputGroup.Text>
            <Form.Control
              type="number"
              value={newTemplate.price}
              onChange={(ev) =>
                setNewTemplate({ ...newTemplate, price: ev.target.value })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Event Type</InputGroup.Text>
            <Form.Control
              type="text"
              value={newTemplate.event_type}
              onChange={(ev) =>
                setNewTemplate({ ...newTemplate, event_type: ev.target.value })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Image</InputGroup.Text>
            {loading ? (
              <Spinner animation="border" />
            ) : (
              <Form.Control
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  fileSelected(e);
                }}
              />
            )}
          </InputGroup>
          {fileData || newTemplate.image ? (
            <img
              src={fileData || newTemplate.image}
              alt="Preview"
              className="img-preview"
            />
          ) : null}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddTemplate}>
          Add Template
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventTemplateModal;
