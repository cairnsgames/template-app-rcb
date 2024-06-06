import React, { useEffect, useState } from "react";
import { Calendar, CheckCircle, CodeSquare } from "react-bootstrap-icons";
import Wizard from "./wizard";
import SelectDay from "../calendar/selectday";
import CalendarDayView from "../calendar/calendardayview";
import EventForm from "../calendar/eventform";
import Confirm from "../calendar/confirm";

const WizardSample = () => {
  const [lastStep, setLastStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [appointments, setAppointments] = useState([
    { name: "Event 1", startingTime: "08:30", duration: "60", description: "A dance class", location: "Dance Studio" },
    { name: "Event 2", startingTime: "11:00", duration: "90", description: "A dance class", location: "Dance Studio" },
  ]);  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '60',
    location: '',
  });
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Kizomba",
      description: "Kizomba dance class",
      duration: "60",
      location: "Dance Studio",
    },
    {
      id: 2,
      name: "Salsa",
      description: "Salsa dance class",
      duration: "60",
      location: "Dance Studio",
    },
  ]);

  const [selectedSlots, setSelectedSlots] = useState([]);

  useEffect(() => {
    console.log("FORM DATA", formData)
    if (formData.name && formData.location && formData.duration) {
      setLastStep(4);
    }
  }, [formData]);

  useEffect(() => {
    if (selectedDay && lastStep < 2) {
      setLastStep(2);
    }
  }, [selectedDay]);

  const selectDay = (day) => {
    setSelectedDay(day);
  };

  const selectTime = (time, maxDuration) => {
    console.log("Selecting Time", { time: time, duration: maxDuration })
    setSelectedTime({ time: time, duration: maxDuration });
    setLastStep(3);
  };

  useEffect(() => {
    console.log("Last Step", lastStep)
  }, [lastStep]);

  const onSaveDetails = () => {
    const { name, duration, time } = formData;

    console.log("SAVE DETAILS", name, duration, time);
    
    // Create new appointments for each time
    const newAppointments = time.map(startingTime => ({
      name,
      description: formData.description,
      location: formData.location,
      startingTime,
      duration
    }));
    
    // Update the state with new appointments
    setAppointments(prevAppointments => [
      ...prevAppointments,
      ...newAppointments
    ]);
  
    console.log("SAVE DETAILS", formData);
    setFormData({ 
      name: '',
      description: '',
      duration: '60',
      location: '',
    });
    setSelectedTime([]);
    setSelectedSlots([]);
  };
  

  return (
    <Wizard onSave={onSaveDetails} lastActiveStep={lastStep - 1}>
      <Wizard.Step
        title={
          <Wizard.StepTitle>
            <Calendar className="d-none d-md-block me-2" /> Date 
          </Wizard.StepTitle>
        }
      >
        <SelectDay disablePastDates={false} onSelectDay={selectDay} />
      </Wizard.Step>
      <Wizard.Step
        title={
          <Wizard.StepTitle>
            <CodeSquare className="d-none d-md-block me-2" />
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
            <CodeSquare className="d-none d-md-block me-2" />
            Details
          </Wizard.StepTitle>
        }
      >
        <EventForm
          maxDuration={selectedTime?.duration}
          time={selectedTime?.time}
          date={selectedDay}
          onSaveDetails={onSaveDetails}
          templates={templates}
          setTemplates={setTemplates}
          formData={formData}
           setFormData={setFormData}
        />
      </Wizard.Step>
      <Wizard.Step
        title={
          <Wizard.StepTitle>
            <CheckCircle className="d-none d-md-block me-2" /> Confirm
          </Wizard.StepTitle>
        }
      >
        <Confirm formData={formData} date={selectedDay} time={selectedTime} />
      </Wizard.Step>
    </Wizard>
  );
};

export default WizardSample;
