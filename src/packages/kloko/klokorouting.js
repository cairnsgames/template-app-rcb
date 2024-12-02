import React from "react";
import Router, { Route, Default } from "../router/router";
import KlokoMyEvents from "./klokomyevents";
import KlokoEvents from "./klokoevents";
import PageFull from "../../parts/pagelayouts/pagefull";

function KlokoRouting() {
  console.log("KlokoSample")
  return (
    <PageFull className="my-3">
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
    </PageFull>
  );
}

export default KlokoRouting;
