import { Row } from "react-bootstrap";
import PageWrapper from "../../parts/pagewrapper";
import Summary from "../../packages/auth/components/summary";

const AuthSummaryPage = () => {
  return (
    <PageWrapper position="middle" >
      <Row className="border-bottom">
        <Summary />
      </Row>
    </PageWrapper>
  );
};

export default AuthSummaryPage;
