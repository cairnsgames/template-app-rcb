import { format } from "date-fns";

export const formatDate = (dateString) => {
  return format(new Date(dateString), "yyyy-MM-dd");
};

export const formatStartEndTime = (startTime, endTime) => {
  const start = format(new Date(startTime), "HH:mm");
  const end = format(new Date(endTime), "HH:mm");
  return `${start} - ${end}`;
};
