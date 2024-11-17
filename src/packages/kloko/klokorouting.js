import React from "react";
import Router, { Route, Default } from "../router/router";
import PageCentered from "../../parts/pagelayouts/pagecentered";;
import KlokoMyEvents from "./klokomyevents";
import KlokoEvents from "./klokoevents";

function KlokoRouting() {
  console.log("KlokoSample")
  return (
    <PageCentered className="my-3">
      <Router>
        <Route is={"events/myevents/{id}"}>
          <KlokoMyEvents />
        </Route>
        <Route is={"events/myevents"}>
          <KlokoMyEvents />
        </Route>
        <Route is={"events/{id}"} debug={true}>
          <KlokoMyEvents />
        </Route>
        <Route is={"events"}>
          <KlokoEvents />
        </Route>
      </Router>
    </PageCentered>
  );
}

export default KlokoRouting;
