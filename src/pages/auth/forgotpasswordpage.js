import { Row } from "react-bootstrap";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import ForgotPasswordForm from "@cairnsgames/auth/forms/forgot";


const ForgotPasswordPage = () => {
  return (
    <PageCentered position="middle" >
      <Row className="border-bottom">
        <ForgotPasswordForm />
      </Row>
      
      <Row className="mt-3">
        <div className="d-flex justify-content-evenly">
          <a href="#login" className="ms-2">Login</a>
          <a href="#register" className="me-2">Create Account</a>
        </div>
      </Row>
    </PageCentered>
  );
};

export default ForgotPasswordPage;
