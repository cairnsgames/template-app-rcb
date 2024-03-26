import { Row } from "react-bootstrap";
import PageWrapper from "../../../parts/pagewrapper";
import LoginForm from "../forms/login"

const LoginPage = ({onSuccess}) => {
  return (
    <PageWrapper position="middle" >
      <Row className="border-bottom">
        <LoginForm onSuccess={onSuccess}/>
      </Row>
      <Row className="mt-3">
        <div className="d-flex justify-content-evenly">
          <a href="#register" className="me-2">Create Account</a>
          <a href="#forgot" className="ms-2">Forgot Password</a>
        </div>
      </Row>
    </PageWrapper>
  );
};

export default LoginPage;
