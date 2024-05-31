import { Row } from "react-bootstrap";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import PermissionsSummary from "../../packages/membership/forms/application/permissions/summary";

const AuthPermissionsPage = () => {
  
  return (
    <PageCentered position="middle" >
      <Row className="border-bottom">
        <PermissionsSummary />
      </Row>
    </PageCentered>
  );
};

export default AuthPermissionsPage;
