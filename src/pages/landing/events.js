import React from 'react';
import Masonry from "../../components/masonry/masonry";
import EventCard from "../event/eventcard";

const Events = () => {
    return (
        <div className="pb-5">
            <h3>Upcoming Events</h3>
        <Masonry>
          <EventCard title="Alps Cycle tour" src="1.png"/>
          <EventCard title="Event Title" src="2.png" width="256px" />
        </Masonry>
        </div>)
}

export default Events;