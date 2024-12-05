import React, { useState, useEffect } from "react";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import SelectLocationModal from "../gps/selectlocationmodal";
import { useTemplates } from "./context/usetemplates";
import { useEvents } from "./context/useevents";

const EventDetailsModal = ({ events, onSave, onClose }) => {
  const [details, setDetails] = useState(events[0]);
  const [template, setTemplate] = useState(0);
  const {templates} = useTemplates();
  const { createEvent } = useEvents();

  const selectPosition = (position) => {
    console.log("position", position);
    setDetails({ ...details, lat: position[0].toFixed(3), lng: position[1].toFixed(3) });
  }
  const save = () => {
    onSave(
      events.map((event) => {        
        event.backgroundColor = "";
        event.extendedProps.state = "saved";
        const newEvent= {
          id: event.id,
          title: details.title,
          description: details.description,
          max_participants: details.max_participants,
          event_template_id: details.id,
          duration: details.duration,
          start: event.start,
          end: event.end,
          start_time: event.start,
          end_time: event.end,
          keywords: details.keywords,
          event_type: details.event_type,
          style: details.keyword,
          price: details.price,
          location: details.location,
          lat: details.lat,
          lng: details.lng
        };
        createEvent(newEvent);
        return newEvent;
      })
    );
  };
  const selectTemplate = (ev) => {
    const template = templates.find((template) => template.id == ev.target.value);
    setDetails(template);
    setTemplate(ev.target.value);
  }
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header>
        <Modal.Title>Event Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div  className="mb-3 border-bottom bg-grey" >
        <Form.Select aria-label="Select a template" value={template} onChange={selectTemplate}>
         <option value={0}>Use a template</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>{template.title}</option>
          ))}
        </Form.Select>
        </div>
        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Text>Event Title</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Enter event title"
              value={details.title}
              onChange={(ev) =>
                setDetails({ ...details, title: ev.target.value })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Description</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Enter event title"
              value={details.description}
              onChange={(ev) =>
                setDetails({ ...details, description: ev.target.value })
              }
            />
          </InputGroup> 
          <InputGroup className="mb-3">
            <InputGroup.Text>Style</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Enter event title"
              value={details.keywords}
              onChange={(ev) =>
                setDetails({ ...details, keywords: ev.target.value })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Event Type</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Enter event title"
              value={details.event_type}
              onChange={(ev) =>
                setDetails({ ...details, event_type: ev.target.value })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Max Participants</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Event Description"
              value={details.max_participants}
              onChange={(ev) =>
                setDetails({ ...details, max_participants: ev.target.value })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3" >
            <InputGroup.Text>Price (US$)</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Price in US$"
              value={details.price}
              onChange={(ev) =>
                setDetails({ ...details, price: ev.target.value })
              }
            />
          </InputGroup>
          <InputGroup className="mb-3" >
              <InputGroup.Text>Location</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="lat"
                value={details.lat}
                onChange={(ev) =>
                  setDetails({ ...details, lat: ev.target.value })
                }
              />
              <Form.Control
                type="text"
                placeholder="lng"
                value={details.lng}
                onChange={(ev) =>
                  setDetails({ ...details, lng: ev.target.value })
                }
              />
            <SelectLocationModal onSelectLocation={(position)=>{selectPosition(position)}} />
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => save()}>
          Save
        </Button>
        <Button variant="primary" onClick={() => onClose()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventDetailsModal;
