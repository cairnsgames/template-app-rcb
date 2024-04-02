import ContentItem from "../../packages/content/components/contentitem";
import EventList from "../event/eventlist";

const HomePage = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <ContentItem id="13" style={{maxWidth:"90%",margin:"1rem"}} />
            {/* <EventList /> */}
        </div>
    )
}

export default HomePage;