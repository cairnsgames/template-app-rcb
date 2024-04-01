import { Container } from "react-bootstrap";
import EventCard from "./eventcard";
import Masonry from "../../components/masonry/masonry";


const EventListPage = () => {
  return (
    <Container>
      <h3>EVENTS</h3>
      <Masonry>
        <EventCard id="1" title="Alps Cycle tour" src="103.jpg" />
        <EventCard id="2" title="Event Title" src="101.jpg" width="256px" />
        <EventCard id="3" title="Event Title" src="102.jpg" width="256px" />
        <EventCard id="4" title="Event Title" src="104.jpg" />
        <EventCard id="5" title="Event Title" src="4.png" />
        <EventCard id="6" title="Event Title" src="8.png" />
        <EventCard id="7" title="Event Title" src="6.png" width="256px" />
        <EventCard id="8" title="Event Title" src="9.png" width="256px" />
      </Masonry>
    </Container>
  );
};

export default EventListPage;
