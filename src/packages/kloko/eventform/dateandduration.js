import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="border p-2 my-3">
      <h3>{t('dateAndDuration.title')}</h3>
      <Form.Group controlId="duration">
        <Form.Group controlId="durationType">
          <Form.Label>{t('dateAndDuration.durationType')}</Form.Label>
          <InputGroup>
            <Form.Check
              type="radio"
              label={t('dateAndDuration.fixed')}
              name="durationType"
              className="ms-3"
              value="duration"
              checked={durationType === "duration" || !durationType}
              onChange={() => setDurationType("duration")}
            />
            <Form.Check
              type="radio"
              label={t('dateAndDuration.custom')}
              name="durationType"
              className="ms-3"
              value="custom"
              checked={durationType === "custom"}
              onChange={() => setDurationType("custom")}
            />
            <Form.Check
              type="radio"
              label={t('dateAndDuration.fullDay')}
              name="durationType"
              className="ms-3"
              value="fullDay"
              checked={durationType === "fullDay"}
              onChange={() => setDurationType("fullDay")}
            />
            <Form.Check
              type="radio"
              label={t('dateAndDuration.multiday')}
              name="durationType"
              className="ms-3"
              value="multiday"
              checked={durationType === "multiday"}
              onChange={() => setDurationType("multiday")}
            />
          </InputGroup>
        </Form.Group>

        {(!durationType || durationType === "duration") && (
          <>
            <Form.Group controlId="startTime">
              <Form.Label>{t('dateAndDuration.startTime')}</Form.Label>
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
              <Form.Label>{t('dateAndDuration.customDuration')}</Form.Label>
              <InputGroup>
                <Form.Select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                >
                  <option value="">{t('dateAndDuration.selectDuration')}</option>
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                  <option value="180">3 hours</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>
          </>
        )}

        {durationType === "custom" && (
          <>
            <Form.Group controlId="startTime">
              <Form.Label>{t('dateAndDuration.startTime')}</Form.Label>
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
              <Form.Label>{t('dateAndDuration.customDuration')}</Form.Label>
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
            <Form.Label>{t('dateAndDuration.startTime')}</Form.Label>
            <InputGroup>
              <Form.Control
                type="date"
                value={startTime.substring(0, 10)} 
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
              <Form.Label>{t('dateAndDuration.startTime')}</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  value={startTime.substring(0, 10)} 
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>{t('dateAndDuration.endDate')}</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  value={endTime.substring(0, 10)} 
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
