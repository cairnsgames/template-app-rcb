import React, { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Search2Provider, useSearch2 } from "./context/search2context";
import SearchTab from "./components/SearchTab";
import ClassesTab from "./components/ClassesTab";

// ---------------------------------------------------------------------------
// Search2Inner (uses context, needs to be inside provider)
// ---------------------------------------------------------------------------

type Search2Props = {
  layout?: string;
};

const Search2Inner: React.FC<Search2Props> = ({ layout }) => {
  const { loadConfig } = useSearch2();

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return (
    <div className="search2">
      <Tabs defaultActiveKey="search" id="search2-tabs" className="mb-3">
        <Tab eventKey="search" title="Search">
          <SearchTab />
        </Tab>
        <Tab eventKey="classes" title="Classes">
          <ClassesTab />
        </Tab>
      </Tabs>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Search2 (exported – wraps its own provider so it's self-contained)
// ---------------------------------------------------------------------------

const Search2: React.FC<Search2Props> = (props) => (
  <Search2Provider>
    <Search2Inner {...props} />
  </Search2Provider>
);

export default Search2;
