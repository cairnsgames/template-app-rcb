import React from "react";
import News from "./news";
import { NewsProvider } from "./context/newscontext";
import Router, { Route, Default } from "../router/router";
import FullNewsItem from "./fullnewsitem";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import MyNews from "./mynews";
import MyNewsEditor from "./mynewseditor";

function NewsSample() {
  console.log("NewsSample")
  return (
    <PageCentered className="my-3">
    <NewsProvider>
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
    </NewsProvider>
    </PageCentered>
  );
}

export default NewsSample;
