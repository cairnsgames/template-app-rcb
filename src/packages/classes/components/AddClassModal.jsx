import React, { useState, useEffect } from 'react';
import { useClasses } from '../context/ClassContext';
import { startOfDay, endOfDay, startOfHour, addHours } from 'date-fns';
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import LocationSelect from '../../kloko/LocationSelect';

const AddClassModal = ({ isOpen, onClose, classToEdit, currentDate }) => {
  const { addClass, updateClass } = useClasses();

  const [formData, setFormData] = useState({
    title: '',
    start_time: '',
    end_time: '',
    location: '',
    lat: '', lng: '',
    max_participants: 20,
    currentEnrollment: 0,
    isMultiDay: false,
    description: '',
    keywords: '',
    currency: 'ZAR',
    price: 1000,
    overlay_text: "N",
    enable_bookings: "Y",
    show_as_news: "N",
    repeatPattern: {
      enabled: false,
      type: 'weekly',
      until: ''
    }
  });

  const setLocation = (location) => {
    const data = { ...formData, lat: location.lat, lng: location.lng, location: location.name };
    setFormData(data);
  }

  useEffect(() => {
    if (isOpen && classToEdit) {
      setFormData({
        ...classToEdit,
        start_time: new Date(classToEdit.start_time).toISOString().slice(0, 16),
        end_time: new Date(classToEdit.end_time).toISOString().slice(0, 16),
        repeatPattern: { ...formData.repeatPattern, enabled: false },
      });
    } else if (isOpen) {
      const baseDate = currentDate ? new Date(currentDate) : new Date();
      const nextHour = startOfHour(addHours(baseDate, 1));
      const startTimeString = nextHour.toISOString().slice(0, 16);
      const endTimeString = addHours(nextHour, 1).toISOString().slice(0, 16);

      setFormData((prev) => ({
        ...prev,
        start_time: startTimeString,
        end_time: endTimeString,
      }));
    }
  }, [isOpen, classToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = new Date(formData.start_time);
    const endDate = new Date(formData.end_time);
    const durationInMinutes = (endDate - startDate) / 60000;
    
    const classData = {
      ...formData,
      start_time: startDate,
      end_time: endDate,
      duration: durationInMinutes,
    };

    if (classToEdit) {
      updateClass(classToEdit.id, classData);
    } else {
      addClass(classData);
    }

    onClose();
  };

  const handleMultiDayToggle = (checked) => {
    const baseDate = currentDate ? new Date(currentDate) : new Date();
    let newStartTime = '';
    let newEndTime = '';

    if (checked) {
      // For multiday events, set start to start of day and end to end of day
      const startOfDayDate = startOfDay(now);
      const endOfDayDate = endOfDay(now);
      
      newStartTime = startOfDayDate.getFullYear() + '-' +
        String(startOfDayDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(startOfDayDate.getDate()).padStart(2, '0');
      
      newEndTime = endOfDayDate.getFullYear() + '-' +
        String(endOfDayDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(endOfDayDate.getDate()).padStart(2, '0');
    } else {
      // For regular classes, set start to next hour and end to hour after that
      const nextHour = startOfHour(addHours(now, 1));
      const endTime = addHours(nextHour, 1);
      
      newStartTime = nextHour.getFullYear() + '-' +
        String(nextHour.getMonth() + 1).padStart(2, '0') + '-' +
        String(nextHour.getDate()).padStart(2, '0') + 'T' +
        String(nextHour.getHours()).padStart(2, '0') + ':00';
      
      newEndTime = endTime.getFullYear() + '-' +
        String(endTime.getMonth() + 1).padStart(2, '0') + '-' +
        String(endTime.getDate()).padStart(2, '0') + 'T' +
        String(endTime.getHours()).padStart(2, '0') + ':00';
    }

    setFormData(prev => ({
      ...prev,
      isMultiDay: checked,
      start_time: newStartTime,
      end_time: newEndTime,
      repeatPattern: {
        ...prev.repeatPattern,
        enabled: checked ? false : prev.repeatPattern.enabled
      }
    }));
  };

  if (!isOpen) return null;

  const handleStartTimeChange = (e) => {
    const newStartTime = new Date(e.target.value);
    const currentEndTime = new Date(formData.end_time);
    const duration = (currentEndTime - new Date(formData.start_time)) / 60000; // duration in minutes

    const newEndTime = new Date(newStartTime.getTime() + duration * 60000);
    setFormData((prev) => ({
      ...prev,
      start_time: e.target.value,
      end_time: newEndTime.getFullYear() + '-' +
      String(newEndTime.getMonth() + 1).padStart(2, '0') + '-' +
      String(newEndTime.getDate()).padStart(2, '0') + 'T' +
      String(newEndTime.getHours()).padStart(2, '0') + ':' +
      String(newEndTime.getMinutes()).padStart(2, '0'),
    }));
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = new Date(e.target.value);
    const startTime = new Date(formData.start_time);

    if (newEndTime <= startTime) {
      const adjustedEndTime = new Date(startTime.getTime() + 60 * 60000); // 60 minutes after start time
      setFormData((prev) => ({
        ...prev,
        end_time: adjustedEndTime.getFullYear() + '-' +
          String(adjustedEndTime.getMonth() + 1).padStart(2, '0') + '-' +
          String(adjustedEndTime.getDate()).padStart(2, '0') + 'T' +
          String(adjustedEndTime.getHours()).padStart(2, '0') + ':' +
          String(adjustedEndTime.getMinutes()).padStart(2, '0'),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        end_time: e.target.value,
      }));
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{classToEdit ? "Edit Class" : "Add New Class"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Class Title</Form.Label>
            <Form.Control
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type={formData.isMultiDay ? "date" : "datetime-local"}
              required
              value={formData.start_time}
              onChange={handleStartTimeChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type={formData.isMultiDay ? "date" : "datetime-local"}
              required
              value={formData.end_time}
              min={formData.start_time} // Prevent selecting dates earlier than start time
              onChange={handleEndTimeChange}
            />
          </Form.Group>
          <LocationSelect value={formData.location} onChange={setLocation} />
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <InputGroup className="mb-3">
              <Form.Select
                value={formData.currency}
                onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
              >
                <option value="ZAR">ZAR</option>
                <option value="USD">USD</option>
              </Form.Select>
              <Form.Control
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) }))}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Keywords</Form.Label>
            <Form.Control
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData((prev) => ({ ...prev, keywords: e.target.value }))}
            />
            <Form.Text className="text-muted">
              Separate keywords with commas. E.g. Salsa, Couples, Advanced
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Max Capacity</Form.Label>
            <Form.Control
              type="number"
              required
              min="1"
              value={formData.max_participants}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, max_participants: parseInt(e.target.value) }))
              }
            />
          </Form.Group>
          {!classToEdit && !formData.isMultiDay && (
            <Form.Check
              type="checkbox"
              id="repeatClass"
              label="Repeat Class"
              checked={formData.repeatPattern.enabled}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  repeatPattern: {
                    ...prev.repeatPattern,
                    enabled: e.target.checked,
                  },
                }))
              }
              className="mb-3"
            />
          )}
          {formData.repeatPattern.enabled && !formData.isMultiDay && (
            <div className="ps-3">
              <Form.Group className="mb-3">
                <Form.Label>Repeat Type</Form.Label>
                <Form.Select
                  value={formData.repeatPattern.type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      repeatPattern: {
                        ...prev.repeatPattern,
                        type: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Repeat Until</Form.Label>
                <Form.Control
                  type="date"
                  required={formData.repeatPattern.enabled}
                  value={formData.repeatPattern.until}
                  min={formData.start_time} // Prevent selecting dates earlier than start time
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      repeatPattern: {
                        ...prev.repeatPattern,
                        until: e.target.value,
                      },
                    }))
                  }
                />
              </Form.Group>
            </div>
          )}
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {classToEdit ? "Update Class" : "Add Class"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddClassModal;