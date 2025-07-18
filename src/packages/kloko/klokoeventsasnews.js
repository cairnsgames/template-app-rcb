import React from "react";
import { useEvents } from "./context/useevents";
import EventCard from "./eventcard"; // Assuming an EventCard component exists

const EventDisplay = ({ item, onClick, layout }) => {
    return <EventCard item={item} onClick={onClick} />;
  
};

export const EventItems = ({ count, layout, onClick }) => {
  const { events } = useEvents(); 
  const items = events.filter(ev => ev.show_as_news === "Y").slice(0, count);
  
  return (
    <>
      {items.map((item) => {
          return <EventDisplay key={item.id} item={item} layout={layout} onClick={onClick} />;
      })}
    </>
  );
}

const Events = ({ layout = "default", items = 99999 }) => {

  const handleItemClick = (id) => {
    window.location.hash = `#events/${id}`; 
  };

  return (
    <div className="events">
      <div className="text-center">
        <h3>Upcoming Events</h3>
      </div>
      <EventItems items={items} layout={layout} onClick={handleItemClick} />
    </div>
  );
};

export default Events;
