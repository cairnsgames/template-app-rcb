import { Row } from "react-bootstrap";
import PageCentered from "../../../parts/pagelayouts/pagecentered";
import Summary from "../component/summary";

const TenantSummaryPage = () => {
  return (
    <PageCentered position="middle" >
      <Row className="border-bottom">
        <Summary />
      </Row>
    </PageCentered>
  );
};

export default TenantSummaryPage;
