import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import ClassCard from "./classcard";
import WeekDaysHeader from "./weekdaysheader";

const MobileDayView = ({ selectedDate, getDayClasses, handleClassClick, handleEditClass }) => {
  const dayClasses = getDayClasses(selectedDate);

  return (
    <Row className="m-4" style={{ minHeight: "50vh" }}>
      {dayClasses.map((cls) => (
        <Col xs={12} md={6}>
          <Card className="shadow">
            <ClassCard
              key={cls.id}
              cls={cls}
              onClick={() => handleClassClick(cls)}
              onEdit={() => handleEditClass(cls)} // Pass handleEditClass to ClassCard
              variant="mobile"
            />
            {dayClasses.length === 0 && (
              <Card.Body className="text-center text-muted">
                No classes scheduled for this day
              </Card.Body>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default MobileDayView;
