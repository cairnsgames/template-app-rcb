import LoyaltySystems from "./loyaltysystem";
import { Card } from "react-bootstrap";
import Router, { Route, Default } from "../router/router";

import PageFull from "../../parts/pagelayouts/pagefull";
import PageCentered from "../../parts/pagelayouts/pagecentered";

const Loyalty = (props) => {
  return (
    <PageCentered className="mt-3">
      <LoyaltySystems />
    </PageCentered>
  );
};

export default Loyalty;
