import React from "react";
import { format } from "date-fns";
import { Card, Row, Col } from "react-bootstrap";
import { formatDate, formatStartEndTime } from "./functions";
import useUser from "../../auth/context/useuser";

const ClassCard = ({ cls, onClick, onEdit, variant = "desktop" }) => {
  const { user } = useUser();
  const isTeacher = Number(user?.id) === Number(cls.instructor_id);

  const onClickClass = (e) => {
    e.stopPropagation();
    onClick(cls);
  };

  const onEditClass = (e) => {
    e.stopPropagation();
    onEdit(cls);
  };

  if (variant === "desktop") {
    return (
      <div
        className={
          cls.isMultiDay
            ? "bg-purple-100 text-purple-800 p-2 rounded text-xs cursor-pointer hover:bg-purple-200 mb-2"
            : "bg-indigo-100 text-indigo-800 p-1 rounded text-xs cursor-pointer hover:bg-indigo-200"
        }
        onClick={onClickClass}
      >
        <div className="fw-medium">
          {cls.title}
          {isTeacher && (
            <span className="text-sm text-gray-500 ms-1"> (You)</span>
          )}
        </div>
        <div>
          {formatDate(cls.start_time)}
          {cls.isMultiDay && (
            <span className="ms-1 text-purple-600">
              {formatStartEndTime(cls.start_time, cls.end_time)}
            </span>
          )}
        </div>
        <div className={cls.isMultiDay ? "text-purple-600" : "text-indigo-600"}>
          {cls.currentEnrollment ?? 0}/{cls.max_participants} enrolled
        </div>
        <div>
          {cls.currency} {cls.price}
        </div>
      </div>
    );
  } else {
    return (
      <Card.Body
      className={`border-bottom last:border-bottom-0 cursor-pointer ${
        cls.isMultiDay ? "bg-purple-50" : ""
      }`}
      onClick={onClickClass}
      >
      <div className="d-flex justify-content-between align-items-center">
        <Card.Title className="h5 mb-0">
        {cls.title}
        </Card.Title>
        <div>
        <button className="btn btn-sm btn-outline-primary me-2" onClick={onEditClass}>Edit</button>
        {/* <button className="btn btn-sm btn-outline-danger">Delete</button> */}
        </div>
      </div>
      {variant === "search" && (
        <>
        {formatDate(cls.start_time)}{" "}
        {formatStartEndTime(cls.start_time, cls.end_time)}
        </>
      )}

      {cls.isMultiDay && (
        <div className="text-purple-600 mt-1">
        {cls.start_time} - {cls.end_time}
        </div>
      )}
      <Card.Text className="text-muted text-sm">
        Organiser: {cls.instructor}
      </Card.Text>
      <div className="d-flex justify-content-between">
        <div>
        {cls.currentEnrollment ?? 0} / {cls.max_participants} enrolled
        </div>
        <div>
        {cls.currency} {cls.price}
        </div>
      </div>
      </Card.Body>
    );
  }
};

export default ClassCard;
