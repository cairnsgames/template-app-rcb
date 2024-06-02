import React, { useEffect, useState } from "react";
import { Calendar, CheckCircle, CodeSquare } from "react-bootstrap-icons";
import Wizard from "./wizard";
import SelectDay from "../calendar/selectday";
import CalendarDayView from "../calendar/calendardayview";
import EventForm from "../calendar/eventform";

const WizardSample = () => {
  const [lastStep, setLastStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [appointments, setAppointments] = useState([
    { name: "Event 1", startingTime: "08:30", duration: "60" },
    { name: "Event 2", startingTime: "11:00", duration: "90" },
  ]);

  const [selectedSlots, setSelectedSlots] = useState([]);

  const handleSave = () => {
    alert("Wizard completed and data saved!");
  };

  useEffect(() => {
    if (selectedDay && lastStep < 2) {
      setLastStep(2);
    }
  }, [selectedDay]);

  const selectDay = (day) => {
    setSelectedDay(day);
  };

  const selectTime = (time, maxDuration) => {
    setSelectedTime({ time: time, duration: maxDuration });
    setLastStep(3);
  };

  const onSaveDetails = (formData) => {
    const { name, duration, time } = formData;
    
    // Create new appointments for each time
    const newAppointments = time.map(startingTime => ({
      name,
      startingTime,
      duration
    }));
    
    // Update the state with new appointments
    setAppointments(prevAppointments => [
      ...prevAppointments,
      ...newAppointments
    ]);
  
    console.log("SAVE DETAILS", formData);
  };
  

  return (
    <Wizard onSave={handleSave} lastActiveStep={lastStep - 1}>
      <Wizard.Step
        title={
          <Wizard.StepTitle>
            <Calendar className="me-2" /> Date
          </Wizard.StepTitle>
        }
      >
        <SelectDay disablePastDates={false} onSelectDay={selectDay} />
      </Wizard.Step>
      <Wizard.Step
        title={
          <Wizard.StepTitle>
            <CodeSquare className="me-2" />
            Time
          </Wizard.StepTitle>
        }
      >
        <CalendarDayView
          appointments={appointments}
          selectTime={selectTime}
          multiselect={true}
          selectedSlots={selectedSlots}
          setSelectedSlots={setSelectedSlots}
        />
      </Wizard.Step>
      <Wizard.Step
        title={
          <Wizard.StepTitle>
            <CodeSquare className="me-2" />
            Details
          </Wizard.StepTitle>
        }
      >
        <EventForm
          maxDuration={selectedTime?.duration}
          time={selectedTime?.time}
          date={selectedDay}
          onSaveDetails={onSaveDetails}
          templates={[
            {
              name: "Kizomba",
              description: "Kizomba dance class",
              duration: "60",
              location: "Dance Studio",
            },
            {
              name: "Salsa",
              description: "Salsa dance class",
              duration: "60",
              location: "Dance Studio",
            },
          ]}
        />
      </Wizard.Step>
      <Wizard.Step
        title={
          <Wizard.StepTitle>
            <CheckCircle className="me-2" /> Confirm
          </Wizard.StepTitle>
        }
      >
        <h3>Step 3 Content</h3>
        <p>This is the content for step 3.</p>
      </Wizard.Step>
    </Wizard>
  );
};

export default WizardSample;
