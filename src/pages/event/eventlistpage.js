import { Container } from "react-bootstrap";
import EventCard from "./eventcard";
import Masonry from "../../components/masonry/masonry";
import EventList from "./eventlist";


const EventListPage = () => {
  return (
    <Container>
      <h3>EVENTS</h3>
     <EventList />
    </Container>
  );
};

export default EventListPage;
