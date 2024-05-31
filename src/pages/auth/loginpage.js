import { Row } from "react-bootstrap";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import LoginForm from "@cairnsgames/auth/forms/login"
import useToast from "@cairnsgames/toasts/usetoast";

const LoginPage = ({onSuccess}) => {
  const { addToast } = useToast();

  const onLogin = () => {
    addToast("Login Successful", "", "success")
    if (onSuccess) {
      onSuccess()
    } 
  }
  return (
    <PageCentered position="middle" >
      <Row className="border-bottom">
        <LoginForm onSuccess={onLogin}/>
      </Row>
      <Row className="mt-3">
        <div className="d-flex justify-content-evenly">
          <a href="#register" className="me-2">Create Account</a>
          <a href="#forgot" className="ms-2">Forgot Password</a>
        </div>
      </Row>
    </PageCentered>
  );
};

export default LoginPage;
