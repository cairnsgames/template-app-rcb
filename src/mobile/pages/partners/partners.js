import Router, { Route } from "../../../packages/router/router";
import PartnerLandingPage from "./landing/landing";
import Loyalty from "../../../packages/loyalty/loyalty";
import LoyaltyProvider from "../../../packages/loyalty/loyaltyprovider";

const PartnersPage = (props) => {
  console.log("========== PARTNER PROPS", props);

  return (
    <>
      <Router>
        <Route if={!props.isLoggedIn}>
          <PartnerLandingPage />
        </Route>
        <Route is="partner">
          <h1>Partner PAGE</h1>
        </Route>
        <Route is="partner/loyalty">
          <LoyaltyProvider>
              <Loyalty {...props}/>
          </LoyaltyProvider>
        </Route>
      </Router>
    </>
  );
};

export default PartnersPage;
