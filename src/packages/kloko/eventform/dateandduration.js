import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const DateAndDuration = ({
  durationType,
  setDurationType,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  duration,
  setDuration,
}) => {
  return (
    <div className="border p-2 my-3">
      <h3>Date and Duration</h3>
      <Form.Group controlId="duration">
        <Form.Group controlId="durationType">
          <Form.Label>Duration Type</Form.Label>
          <InputGroup>
            <Form.Check
              type="radio"
              label="Fixed"
              name="durationType"
              className="ms-3"
              value="custom"
              checked={durationType === "duration"}
              onChange={() => setDurationType("duration")}
            />
            <Form.Check
              type="radio"
              label="Custom"
              name="durationType"
              className="ms-3"
              value="custom"
              checked={durationType === "custom"}
              onChange={() => setDurationType("custom")}
            />
            <Form.Check
              type="radio"
              label="Full Day"
              name="durationType"
              className="ms-3"
              value="fullDay"
              checked={durationType === "fullDay"}
              onChange={() => setDurationType("fullDay")}
            />
            <Form.Check
              type="radio"
              label="Multiday"
              name="durationType"
              className="ms-3"
              value="multiday"
              checked={durationType === "multiday"}
              onChange={() => setDurationType("multiday")}
            />
          </InputGroup>
        </Form.Group>

        {durationType === "duration" && (
          <>
            <Form.Group controlId="startTime">
              <Form.Label>Start Time</Form.Label>
              <InputGroup>
                <Form.Control
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="durationDuration">
              <Form.Label>Custom Duration (in minutes)</Form.Label>
              <InputGroup>
                <Form.Select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                >
                  <option value="">Select Duration</option>
                  <option value="20">20 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </>
        )}

        {durationType === "custom" && (
          <>
            <Form.Group controlId="startTime">
              <Form.Label>Start Time</Form.Label>
              <InputGroup>
                <Form.Control
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="customDuration">
              <Form.Label>Custom Duration (in minutes)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="Enter duration"
                  value={duration === "custom" ? "" : duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
                <InputGroup.Text>minutes</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </>
        )}

        {durationType === "fullDay" && (
          <Form.Group controlId="startTime">
            <Form.Label>Start Time</Form.Label>
            <InputGroup>
              <Form.Control
                type="date"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setEndTime(e.target.value);
                }}
                required
              />
            </InputGroup>
          </Form.Group>
        )}

        {durationType === "multiday" && (
          <>
            <Form.Group controlId="startTime">
              <Form.Label>Start Time</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
          </>
        )}
      </Form.Group>
    </div>
  );
};

export default DateAndDuration;
