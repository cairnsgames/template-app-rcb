import LoyaltySystems from "./loyaltysystem";
import { Card } from "react-bootstrap";
import Router, { Route, Default } from "../router/router";

import PageFull from "../../parts/pagelayouts/pagefull";

const Loyalty = (props) => {
  return (
    <PageFull>
      <LoyaltySystems />
    </PageFull>
  );
};

export default Loyalty;
