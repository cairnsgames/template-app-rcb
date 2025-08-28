import Router, { Route } from "../../../packages/router/router";
import PartnerLandingPage from "./landing/landing";
import PartnerForm from "./partnerform";
import Loyalty from "../../../packages/loyalty/loyalty";
import LoyaltyProvider from "../../../packages/loyalty/context/loyaltyprovider";
import { usePartnerRoles } from "./usepartnerroles";
import { useUser } from "../../../packages/auth/context/useuser";
import PageFull from "../../../parts/pagelayouts/pagefull";
import PartnerProfilePage from "../../../pages/partner/partnerprofilepage";

const PartnersPage = (props) => {
  const { user } = useUser();
  const { roles } = usePartnerRoles();
  return (
    <PageFull>
      <Router>
        <Route if={!user}>
          <PartnerLandingPage />
        </Route>
        <Route is="partner">
          <PartnerProfilePage roles={roles} />
        </Route>
        <Route is="partner/loyalty">
          <LoyaltyProvider>
            <Loyalty {...props} />
          </LoyaltyProvider>
        </Route>
      </Router>
    </PageFull>
  );
};

export default PartnersPage;
