import { Row } from "react-bootstrap";
import PageWrapper from "../../../parts/pagewrapper";
import Summary from "../component/summary";

const TenantSummaryPage = () => {
  return (
    <PageWrapper position="middle" >
      <Row className="border-bottom">
        <Summary />
      </Row>
    </PageWrapper>
  );
};

export default TenantSummaryPage;
