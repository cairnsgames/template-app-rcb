import Tracker from "../../../tracker/tracker";
import { useMembership } from "../../context/usemembership";

const ApplicationList = () => {
    const { applications } = useMembership();
    
    console.log("ApplicationList", applications)

  return (
    <Tracker itemtype="application" id={0}>
      <h1>Application List</h1>
      <ul>
        {applications.map((application) => (
          <li key={application.id}>
            <a href={`#admin/application/${application.id}`}>{application.name}</a>
          </li>
        ))}
      </ul>
    </Tracker>
  );
};

export default ApplicationList;
