import { Row } from "react-bootstrap";
import PageWrapper from "../../parts/pagewrapper";
import Summary from "./summary";

const SettingsSummaryPage = () => {
  return (
    <PageWrapper position="middle" >
      <Row className="border-bottom">
        <Summary />
      </Row>
    </PageWrapper>
  );
};

export default SettingsSummaryPage;
