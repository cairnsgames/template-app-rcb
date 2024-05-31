import React from "react";
import Docs from "../../packages/doc/doc";
import PageFull from "../../parts/pagelayouts/pagefull";

import { orderData } from "../../packages/doc/order";

const DocsPage = (props) => {

  return (
    <PageFull className="p-2">
      <h1>Docs Page</h1>
      <Docs document={orderData} />
    </PageFull>
  );
};

export default DocsPage;
