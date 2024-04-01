import useLocation from "../../hooks/uselocation";
import ApplicationPage from "./membership/applicationpage";
import { Router, Route } from "../../packages/router/";
import ApplicationList from "../../packages/membership/forms/application/applicationlist";
import Membership from "../../packages/membership/membership";
import { useUser } from "../../packages/auth/context/useuser";

const AdminRoutes = () => {
  const { hash } = useLocation();
  const { hasAccess } = useUser();

  console.log("AdminPage", hash);

  if (!hasAccess("MembershipAdministration")) {
    return <h1>Access Denied</h1>;
  }

  return (
    <Membership>
      <Router>
        <Route is={"admin/application/{id}"}>
          <ApplicationPage />
        </Route>
        <Route is={"admin/application"}>
          <ApplicationList />
        </Route>
      </Router>
    </Membership>
  );
};

export default AdminRoutes;
