import { Row } from "react-bootstrap";
import PageWrapper from "../../parts/pagewrapper";
import ForgotPasswordForm from "@cairnsgames/auth/forms/forgot";


const ForgotPasswordPage = () => {
  return (
    <PageWrapper position="middle" >
      <Row className="border-bottom">
        <ForgotPasswordForm />
      </Row>
      
      <Row className="mt-3">
        <div className="d-flex justify-content-evenly">
          <a href="#login" className="ms-2">Login</a>
          <a href="#register" className="me-2">Create Account</a>
        </div>
      </Row>
    </PageWrapper>
  );
};

export default ForgotPasswordPage;
