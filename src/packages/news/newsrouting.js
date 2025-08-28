import React from "react";
import News from "./news";
import { NewsProvider } from "./context/newscontext";
import Router, { Route, Default } from "../router/router";
import FullNewsItem from "./fullnewsitem";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import MyNews from "./mynews";
import MyNewsEditor from "./mynewseditor";
import PageFull from "../../parts/pagelayouts/pagefull";

function NewsRouting() {
  return (
    <PageFull className="my-3">
        <Router>
          <Route is={"news/mynews/{id}"}>
            <MyNewsEditor />
          </Route>
          <Route is={"news/mynews"}>
            <MyNews />
          </Route>
          <Route is={"news/{id}"} debug={true}>
            <FullNewsItem />
          </Route>
          <Route is={"news"}>
            <News layout="custom" />
          </Route>
        </Router>
    </PageFull>
  );
}

export default NewsRouting;
