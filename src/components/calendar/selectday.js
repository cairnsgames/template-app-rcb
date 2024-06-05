import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { ArrowRight, ChevronLeft, ChevronRight } from "react-bootstrap-icons";

const SelectDay = ({
  highlightedDates = [],
  selectedDate: initialSelectedDate,
  disablePastDates = false,
  onSelectDay,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    initialSelectedDate ? new Date(initialSelectedDate) : new Date()
  );

  useEffect(() => {
    if (onSelectDay) {
      onSelectDay(selectedDate);
    }
  }, [selectedDate]);

  const format = (date, dateFormat) => {
    const options = {
      month: "long",
      year: "numeric",
      day: "numeric",
      weekday: "long",
    };
    if (dateFormat === "long") {
      return new Intl.DateTimeFormat("en-US", options).format(date);
    } else if (dateFormat === "numeric") {
      return date.getDate();
    } else if (dateFormat === "monthYear") {
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(date);
    } else {
      return new Intl.DateTimeFormat("en-US", options).format(date);
    }
  };

  const startOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const endOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const startOfWeek = (date) => {
    const day = date.getDay() || 7;
    if (day !== 1) date.setHours(-24 * (day - 1));
    return date;
  };

  const endOfWeek = (date) => {
    const day = date.getDay() || 7;
    if (day !== 7) date.setHours(24 * (7 - day));
    return date;
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const isSameMonth = (date, monthStart) => {
    return date.getMonth() === monthStart.getMonth();
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.toISOString().split("T")[0] === date2.toISOString().split("T")[0]
    );
  };

  const parseISO = (dateString) => {
    return new Date(dateString);
  };

  useEffect(() => {
    if (initialSelectedDate) {
      setCurrentMonth(new Date(initialSelectedDate));
      setSelectedDate(new Date(initialSelectedDate));
    } else {
      setCurrentMonth(new Date());
    }
  }, [initialSelectedDate]);

  const renderHeader = () => {
    return (
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          variant="outline-primary"
          onClick={prevMonth}
          disabled={disablePastDates && isSameMonth(currentMonth, new Date())}
        >
          <ChevronLeft />
        </Button>
        <h3>{format(currentMonth, "monthYear")}</h3>
        <Button variant="outline-primary" onClick={nextMonth}>
          <ChevronRight />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "long";
    const startDate = startOfWeek(new Date(currentMonth));

    for (let i = 0; i < 7; i++) {
      const dayName = format(addDays(startDate, i), dateFormat).split(",")[0];
      const shortDayName = dayName.slice(0, 3); // Get the first 3 letters of the day name
  
      days.push(
        <Col key={i} className="border-bottom border-right p-2 text-center">
          <span className="d-none d-sm-block">{dayName}</span>
          <span className="d-block d-sm-none">{shortDayName}</span>
        </Col>
      );
    }

    return <Row>{days}</Row>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "numeric";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isHighlighted = highlightedDates.some((d) =>
          isSameDay(parseISO(d), cloneDay)
        );
        const isDisabled = disablePastDates && cloneDay < new Date();
        const style = isSameDay(day, selectedDate)
          ? { border: "2px solid red" }
          : {};
        if (cloneDay < new Date()) {
          style.backgroundColor = "#EEEEEE";
        }
        if (isDisabled) {
          style.backgroundColor = "lightgrey";
        }
        days.push(
          <Col
            key={day}
            className={`${
              !isSameDay(day, selectedDate) ? "border-bottom border-right" : ""
            } p-2 text-center  ${isHighlighted ? "bg-warning" : ""} ${
              isSameDay(day, selectedDate) ? "text-primary" : ""
            } `}
            onClick={() =>
              !isDisabled && onDateClick(parseISO(cloneDay.toISOString()))
            }
            style={style}
          >
            {formattedDate}
          </Col>
        );
        day = addDays(day, 1);
      }
      rows.push(<Row key={day}>{days}</Row>);
      days = [];
    }

    return <div>{rows}</div>;
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <Container>
      <Card>
        <Card.Header>
          <h3>Select a day</h3>
        </Card.Header>
        <Card.Body>
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </Card.Body>
        <Card.Footer>
          <h4>Selected Date: {format(selectedDate, "long")}</h4>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default SelectDay;
