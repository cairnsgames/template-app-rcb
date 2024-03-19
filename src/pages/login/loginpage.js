import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PageWrapper from "../../parts/pagewrapper";
import { Row } from "react-bootstrap";

const LoginPage = () => {
  return (
    <PageWrapper position="middle" >
      <Form className="page-border p-5">
        <h2>Login</h2>
        <hr/>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label="Keep me logged in" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
        <div className="mt-3">
        <Button href="#register" variant="outline-primary">Register an Account</Button>
        <Button href="#forgot" variant="outline-primary">Forgot Password</Button>
        </div>
      </Form>
    </PageWrapper>
  );
};

export default LoginPage;
