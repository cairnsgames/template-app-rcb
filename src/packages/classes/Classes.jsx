import React, { useState } from "react";
import {
  startOfWeek,
  addDays,
  isSameDay,
  addWeeks,
  subWeeks,
  isWithinInterval,
} from "date-fns";
import { useClasses } from "./context/ClassContext";
import { Container } from "react-bootstrap";
import DesktopNavigation from "./components/desktopnavigation";
import MobileNavigation from "./components/mobilenavigation";
import WeekDaysHeader from "./components/weekdaysheader";
import SearchResults from "./components/searchresults";
import DesktopCalendarGrid from "./components/desktopcalendargrid";
import MobileDayView from "./components/mobiledayview";
import DesktopSearch from "./components/desktopsearch";
import AddClassModal from "./components/AddClassModal";
import BookingModal from "./components/BookingModal";

const Classes = ({ role = "dancer"}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [classToEdit, setClassToEdit] = useState(null);
  const { classes } = useClasses(role);

  console.log("Classes to display:", classes);

  const filteredClasses = searchQuery
    ? classes.filter((cls) =>
        cls.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : classes;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const start = startOfWeek(selectedDate);
    return addDays(start, i);
  });

  const getDayClasses = (date) => {
    if (searchQuery) return filteredClasses;

    const dayClasses = classes.filter((cls) => {
      if (cls.isMultiDay) {
        return isWithinInterval(date, {
          start: new Date(cls.start_time),
          end: new Date(cls.end_time),
        });
      }
      return isSameDay(new Date(cls.start_time), date);
    });

    // Sort classes to show multiday events first
    return dayClasses.sort((a, b) => {
      if (a.isMultiDay && !b.isMultiDay) return -1;
      if (!a.isMultiDay && b.isMultiDay) return 1;
      return 0;
    });
  };

  const navigateWeek = (direction) => {
    setSelectedDate((currentDate) =>
      direction === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1)
    );
  };

  const navigateDay = (direction) => {
    setSelectedDate((currentDate) =>
      direction === "next" ? addDays(currentDate, 1) : addDays(currentDate, -1)
    );
  };

  const handleClassClick = (classData) => {
    setSelectedClass(classData);
  };

  const handleEditClass = (classData) => {
    setClassToEdit(classData);
    setIsAddModalOpen(true);
  };

  return (
    <Container
      fluid
      className="d-flex flex-column h-100"
      style={{ padding: "0px" }}
    >
      <DesktopSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsAddModalOpen={setIsAddModalOpen}
      />

      <MobileNavigation
        role={role}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsAddModalOpen={setIsAddModalOpen}
        selectedDate={selectedDate}
        navigateDay={navigateDay}
      />

      <div className="flex-1 overflow-auto">
        {role === "dancer" ? (
          <SearchResults
            filteredClasses={filteredClasses}
            handleClassClick={handleClassClick}
          />
        ) : (
          <MobileDayView
            selectedDate={selectedDate}
            getDayClasses={getDayClasses}
            handleClassClick={handleClassClick}
            handleEditClass={handleEditClass} // Pass handleEditClass to MobileDayView
          />
        )}
      </div>

      <AddClassModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setClassToEdit(null);
        }}
        classToEdit={classToEdit}
      />

      {selectedClass && (
        <BookingModal
          isOpen={!!selectedClass}
          onClose={() => setSelectedClass(null)}
          classData={selectedClass}
        />
      )}
    </Container>
  );
};

export default Classes;
