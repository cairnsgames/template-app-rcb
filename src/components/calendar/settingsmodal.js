import React from 'react';
import { Modal, Button, Container, Row, Col, InputGroup, FormControl, Form } from 'react-bootstrap';
import SlotIntervalDropdown from './slotintervaldropdown';
import HourDropdown from './hourdropdown';

const SettingsModal = ({
  show,
  handleClose,
  slotIntervals,
  allowedIntervals,
  slotInterval,
  handleSlotChange,
  startHour,
  handleStartHourChange,
  endHour,
  handleEndHourChange,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col xs={12}>
              <SlotIntervalDropdown
                slotIntervals={slotIntervals}
                allowedIntervals={allowedIntervals}
                slotInterval={slotInterval}
                handleSlotChange={handleSlotChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <HourDropdown
                title="Start Hour"
                selectedHour={startHour}
                handleHourChange={handleStartHourChange}
              />
            </Col>
            <Col xs={12} md={6}>
              <HourDropdown
                title="End Hour"
                selectedHour={endHour}
                handleHourChange={handleEndHourChange}
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SettingsModal;
