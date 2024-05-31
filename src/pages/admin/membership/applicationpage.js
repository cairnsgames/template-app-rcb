import React, { useEffect, useState } from "react";
import PageCentered from "../../../parts/pagelayouts/pagecentered";
import ApplicationForm from "../../../packages/membership/forms/application/applicationform";
import { useMembership } from "../../../packages/membership/context/usemembership";
import { Tabs, Tab } from "react-bootstrap";
import UserList from "../../../packages/membership/forms/user/userlist";

const ApplicationPage = (props) => {
  const { id } = props;
  console.log("PROPS", props);
  const { applications, findApplication } = useMembership();
  const [application, setApplication] = useState();

  useEffect(() => {
    const app = findApplication(id);
    console.log("Found App", app);
    if (app) {
      app.id = id;
      setApplication(app);
    } else  {
        setApplication(null);
    }
  }, [id, applications]);

  return (
    <PageCentered>
      {application && (
        <>
          <div>
            <h1>{application?.name}</h1>
            ID: {application?.id}
          </div>

          <Tabs defaultActiveKey="details">
            <Tab title="Details" eventKey="details">
              {application?.id === id && (
                <ApplicationForm application={application} />
              )}
            </Tab>
            <Tab title="Permissions" eventKey="permissions"></Tab>
            <Tab title="Roles" eventKey="roles"></Tab>
            <Tab title="Users" eventKey="users">
              <UserList />
            </Tab>
          </Tabs>
        </>
      )}
      {!application && <div>Application not found</div>}
    </PageCentered>
  );
};

export default ApplicationPage;
