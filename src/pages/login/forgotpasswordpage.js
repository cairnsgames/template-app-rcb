import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PageWrapper from "../../parts/pagewrapper";
import { Row } from "react-bootstrap";

const ForgotPasswordPage = () => {
  return (
    <PageWrapper position="middle" >
      <Form className="page-border p-5">
        <h2>Forgot Password</h2>
        <hr/>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <div className="mt-3">
        <Button href="#login" variant="outline-primary">Back to Login</Button>
        <Button href="#register" variant="outline-primary">Register an Account</Button>
        </div>
      </Form>
    </PageWrapper>
  );
};

export default ForgotPasswordPage;
