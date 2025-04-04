import React from "react";
import { Card } from "react-bootstrap";
import { format } from "date-fns";
import ClassCard from "./classcard";

const DesktopCalendarGrid = ({ weekDays, getDayClasses, setSelectedDate, handleClassClick }) => {
  return (
    <div className="d-none d-md-grid grid-cols-7 gap-1 p-2">
      {weekDays.map((day) => {
        const dayClasses = getDayClasses(day);
        return (
          <Card
            key={day.toString()}
            className="min-h-[100px] p-2 border"
            onClick={() => setSelectedDate(day)}
          >
            <Card.Body>
              <Card.Title className="text-sm fw-medium mb-2">{format(day, "d")}</Card.Title>
              <div className="space-y-1">
                {dayClasses.map((cls) => (
                  <ClassCard 
                    key={cls.id} 
                    cls={cls} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClassClick(cls);
                    }}
                    variant="desktop"
                  />
                ))}
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default DesktopCalendarGrid;
