import React from "react";
import { format } from "date-fns";

const WeekDaysHeader = ({ weekDays }) => {
  return (
    <div className="d-none d-md-flex justify-content-between p-2 bg-light">
      {weekDays.map((day) => (
        <div key={day.toString()} className="text-center text-sm fw-medium p-2">
          {format(day, "EEE")}
        </div>
      ))}
    </div>
  );
};

export default WeekDaysHeader;
