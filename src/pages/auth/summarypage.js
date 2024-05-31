import { Row } from "react-bootstrap";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import Summary from "../../packages/auth/components/summary";
import PermissionsSummary from "../../packages/membership/forms/application/permissions/summary";
import FlagsSummary from "../../packages/featureflags/summary";
import SettingsSummary from "../../packages/settings/summary";

const AuthSummaryPage = () => {
  return (
    <PageCentered position="middle" >
      <Row className="border-bottom">
        <Summary />
      </Row>
      
      <Row className="border-bottom">
        <PermissionsSummary />
      </Row>

      
      <Row className="border-bottom">
        <FlagsSummary />
      </Row>

      <Row className="border-bottom">
        <SettingsSummary />
      </Row>
    </PageCentered>
  );
};

export default AuthSummaryPage;
