import { Container } from "react-bootstrap";
import EventCard from "./eventcard";
import Masonry from "../../components/masonry/masonry";
import EventList from "./eventlist";
import KlokoMyEvents from "../../packages/kloko/klokomyevents";


const EventListPage = () => {
  return (
    <Container className="pagesEventListPage">
      <KlokoMyEvents />
    </Container>
  );
};

export default EventListPage;
