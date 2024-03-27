import { Row } from "react-bootstrap";
import PageWrapper from "../../parts/pagewrapper";
import RegistrationForm from "../../packages/auth/forms/register";

const RegisterPage = () => {
  return (
    <PageWrapper position="middle">
      <Row className="border-bottom">
        <RegistrationForm />
      </Row>
      <Row className="mt-3">
        <div className="d-flex justify-content-evenly">
          <a href="#login">Login</a>
        </div>
      </Row>
    </PageWrapper>
  );
};

export default RegisterPage;
