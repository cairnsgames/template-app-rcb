import { addDays } from 'date-fns';

const generateTimeSlots = (date) => {
  const times = [];
  for (let hour = 8; hour <= 20; hour += 3) {
    const timeString = new Date(date).setHours(hour, 0, 0, 0);
    times.push(new Date(timeString).toISOString());
  }
  return times;
};

const generateClassesForDay = (date) => {
  const timeSlots = generateTimeSlots(date);
  return timeSlots.map((startTime, index) => ({
    id: crypto.randomUUID(),
    title: `Class ${index + 1}`,
    startTime,
    endTime: new Date(new Date(startTime).setHours(new Date(startTime).getHours() + 1)).toISOString(),
    instructor: `Instructor ${index + 1}`,
    max_participants: 20,
    currentEnrollment: Math.floor(Math.random() * 15),
    ...(Math.random() > 0.7 && {
      repeatPattern: {
        type: Math.random() > 0.5 ? 'weekly' : 'monthly',
        until: new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()).toISOString(),
      },
    }),
  }));
};

// Add some multiday events
const multiDayEvents = [
  {
    id: crypto.randomUUID(),
    title: 'Yoga Retreat',
    startTime: new Date().toISOString(),
    endTime: addDays(new Date(), 3).toISOString(),
    instructor: 'Sarah Johnson',
    max_participants: 15,
    currentEnrollment: 8,
    isMultiDay: true
  },
  {
    id: crypto.randomUUID(),
    title: 'Dance Workshop',
    startTime: addDays(new Date(), 2).toISOString(),
    endTime: addDays(new Date(), 4).toISOString(),
    instructor: 'Michael Chen',
    max_participants: 20,
    currentEnrollment: 12,
    isMultiDay: true
  }
];

export const mockClasses = [
  ...Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return generateClassesForDay(date);
  }).flat(),
  ...multiDayEvents
];
