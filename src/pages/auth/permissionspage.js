import { Row } from "react-bootstrap";
import PageWrapper from "../../parts/pagewrapper";
import PermissionsSummary from "../../packages/membership/forms/application/permissions/summary";

const AuthPermissionsPage = () => {
  
  return (
    <PageWrapper position="middle" >
      <Row className="border-bottom">
        <PermissionsSummary />
      </Row>
    </PageWrapper>
  );
};

export default AuthPermissionsPage;
