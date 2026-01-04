import React from "react";
import Router, { Route } from "../router/router";
import PartnerList from "./partnerlist";
import PartnerDetail from "./partnerdetail";
import PageFull from "../../parts/pagelayouts/pagefull";

function PartnerRouting() {
  return (
    <PageFull className="my-3">
      <Router>
        <Route is={"partner/{id}"} debug={true}>
          <PartnerDetail />
        </Route>
        <Route is={"partner"}>
          <PartnerList />
        </Route>
      </Router>
    </PageFull>
  );
}

export default PartnerRouting;
