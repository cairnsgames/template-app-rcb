import React from "react";
import { Card } from "react-bootstrap";
import ClassCard from "./classcard";

const MobileDayView = ({ selectedDate, getDayClasses, handleClassClick }) => {
  const dayClasses = getDayClasses(selectedDate);
  
  return (
    <div className="d-md-none p-4">
      <Card className="shadow">
        {dayClasses.map((cls) => (
          <ClassCard 
            key={cls.id} 
            cls={cls} 
            onClick={() => handleClassClick(cls)} 
            variant="mobile" 
          />
        ))}
        {dayClasses.length === 0 && (
          <Card.Body className="text-center text-muted">
            No classes scheduled for this day
          </Card.Body>
        )}
      </Card>
    </div>
  );
};

export default MobileDayView;
