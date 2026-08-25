import React from "react";
import { Row } from "react-bootstrap";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import Summary from "./summary";

const FlagsSummaryPage = () => (
  <PageCentered position="middle">
    <Row className="border-bottom">
      <Summary />
    </Row>
  </PageCentered>
);

export default FlagsSummaryPage;
