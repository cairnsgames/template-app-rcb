import { Container } from "react-bootstrap";
import EventCard from "./eventcard";
import Masonry from "../../components/masonry/masonry";

const EventListPage = () => {
  return (
    <Container>
      <h3>EVENTS</h3>
      <Masonry>
        <EventCard title="Alps Cycle tour" src="103.jpg"/>
        <EventCard title="Event Title" src="101.jpg" width="256px" />
        <EventCard title="Event Title" src="102.jpg" width="256px" />
        <EventCard title="Event Title" src="104.jpg" />
        <EventCard title="Event Title" src="4.png" />
        <EventCard title="Event Title" src="8.png" />
        <EventCard title="Event Title" src="6.png" width="256px" />
        <EventCard title="Event Title" src="9.png" width="256px" />
      </Masonry>
    </Container>
  );
};

export default EventListPage;
