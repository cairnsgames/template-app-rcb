import React from "react";
import Router, { Route, Default } from "../router/router";
import KlokoMyEvents from "./klokomyevents";
import KlokoEvents from "./klokoevents";
import UserLocationManagement from "./locations/UserLocationManagement"; // Import the new component
import PageFull from "../../parts/pagelayouts/pagefull";
import KlokoEventDetail from "./klokoeventdetail";

function KlokoRouting() {
  return (
    <PageFull className="my-3">
      <Router>
        <Route is={"events/myevents/{id}"}>
          <KlokoMyEvents />
        </Route>
        <Route is={"events/myevents"}>
          <KlokoMyEvents />
        </Route>        
        <Route is={"myevents"}>
          <KlokoMyEvents />
        </Route>
        <Route is={"myevents/{id}"} debug={true}>
          <KlokoMyEvents />
        </Route>
        <Route is={"events"}>
          <KlokoEvents />
        </Route>
        <Route is={"events/{id}"} debug={true}>
          <KlokoEventDetail />
        </Route>
        <Route is={"locations"}>
          <UserLocationManagement />
          </Route>
      </Router>
    </PageFull>
  );
}

export default KlokoRouting;
