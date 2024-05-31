import { Row } from "react-bootstrap";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import RegistrationForm from "@cairnsgames/auth/forms/register";

const RegisterPage = () => {
  return (
    <PageCentered position="middle">
      <Row className="border-bottom">
        <RegistrationForm />
      </Row>
      <Row className="mt-3">
        <div className="d-flex justify-content-evenly">
          <a href="#login">Login</a>
        </div>
      </Row>
    </PageCentered>
  );
};

export default RegisterPage;
