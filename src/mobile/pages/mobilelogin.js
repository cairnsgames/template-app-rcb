import { Modal } from "react-bootstrap";
import LoginForm from "../../packages/auth/forms/login";

const MobileLogin = (props) => {
    return (
        <Modal show={true} style={{top:"15%"}}>
            <Modal.Header>
                <Modal.Title>Mobile Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <LoginForm {...props} rememberMe={true} />
            </Modal.Body>
        </Modal>
    );
}

export default MobileLogin;