import React from "react";
import Router, { Route } from "../router/router";
import PartnerList from "./partnerlist";
import PartnerDetail from "./partnerdetail";
import PageFull from "../../parts/pagelayouts/pagefull";
import { usePartnerRoles } from "../../mobile/pages/partners/usepartnerroles";
import { useUser } from "../auth/context/useuser";
import PartnerLandingPage from "../../mobile/pages/partners/landing/landing";
import Loyalty from "../loyalty/loyalty";
import LoyaltyProvider from "../loyalty/context/loyaltyprovider";
import PartnerProfilePage from "../../pages/partner/partnerprofilepage";

function PartnerRouting({ props }) {
  const { user } = useUser();
  const { roles } = usePartnerRoles();
  return (
    <PageFull className="my-3">
      <Router>
        <Route if={!user}>
          <PartnerLandingPage />
        </Route>
        <Route is="partner/loyalty">
          <LoyaltyProvider>
            <Loyalty {...props} />
          </LoyaltyProvider>
        </Route>
        <Route is={"partners"}>
          <PartnerList />
        </Route>
        <Route is="partner/profile">
          <PartnerProfilePage roles={roles} />
        </Route>        
        <Route is={"partner/{id}"} debug={true}>
          <PartnerDetail />
        </Route>
        <Route is="partner">
          <PartnerLandingPage />
        </Route>
      </Router>
    </PageFull>
  );
}

export default PartnerRouting;
