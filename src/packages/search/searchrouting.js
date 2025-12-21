import Router, { Route, Default } from "../router/router";
import PageFull from "../../parts/pagelayouts/pagefull";
import Search from "./search";

function SearchRouting() {
  return (
    <PageFull className="my-3">
        <Router>
          {/* <Route is={"news/mynews/{id}"}>
            <MyNewsEditor />
          </Route>
          <Route is={"news/mynews"}>
            <MyNews />
          </Route>
          <Route is={"news/{id}"} debug={true}>
            <FullNewsItem />
          </Route> */}
          <Route is={"search"}>
            <Search layout="custom" />
          </Route>
        </Router>
    </PageFull>
  );
}

export default SearchRouting;
