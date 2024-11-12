import Router, { Route } from "../../../packages/router/router";
import PartnerLandingPage from "./landing/landing";
import Loyalty from "../../../packages/loyalty/loyalty";
import LoyaltyProvider from "../../../packages/loyalty/context/loyaltyprovider";
import { usePartnerRoles } from "./usepartnerroles";

const PartnersPage = (props) => {
  const { roles } = usePartnerRoles();
  return (
    <>
      <Router>
        <Route if={!props.isLoggedIn}>
          <PartnerLandingPage />
        </Route>
        <Route is="partner">          
          <PartnerLandingPage roles={roles} />
        </Route>
        <Route is="partner/loyalty">
          <LoyaltyProvider>
            <Loyalty {...props} />
          </LoyaltyProvider>
        </Route>
      </Router>
    </>
  );
};

export default PartnersPage;
