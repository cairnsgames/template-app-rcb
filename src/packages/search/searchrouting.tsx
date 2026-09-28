import React from "react";
import Router, { Route } from "../router/router";
import PageFull from "../../parts/pagelayouts/pagefull";
import Search from "../search2/search";

const SearchRouting: React.FC = () => {
  return (
    <PageFull className="my-3 packagesSearchRouting" position="center">
      <Router>
        <Route is={"search"}>
          <Search layout="custom" />
        </Route>
      </Router>
    </PageFull>
  );
};

export default SearchRouting;
