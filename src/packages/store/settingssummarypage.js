import { Row } from "react-bootstrap";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import Summary from "./summary";

const SettingsSummaryPage = () => {
  return (
    <PageCentered position="middle" >
      <Row className="border-bottom">
        <Summary />
      </Row>
    </PageCentered>
  );
};

export default SettingsSummaryPage;
