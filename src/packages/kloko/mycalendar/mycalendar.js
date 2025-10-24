import { EventProvider } from './mycalendarcontext'
import { EventList } from './mycalendarlist'

const MyCalendar = () => {
  return (
    <EventProvider>
      <div style={{ backgroundColor: '#f8f9fa'}}>
        <EventList />
      </div>
    </EventProvider>
  );
}

export default MyCalendar
