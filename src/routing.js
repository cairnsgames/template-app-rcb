import DesignElements from "./pages/design/designelements";
import useLocation from "./hooks/uselocation";
import LoginPage from "./pages/login/loginpage";
import RegisterPage from "./pages/login/registerpage";
import ForgotPasswordPage from "./pages/login/forgotpasswordpage";
import InstaClone from "./apps/instaclone/instaclone";
import WhatsappClone from "./apps/whatsapp/whatsapp";
import Examples from "./getbootstrapexamples/examples";
import Container from "react-bootstrap/Container";

const Routing = () => {
  const { hash } = useLocation();

  return (
    <>
      {hash.length === 0 && <DesignElements />}
      {hash.startsWith("design") && <Container className="mt-3"><DesignElements /></Container>}
      {hash.startsWith("login") && <LoginPage />}
      {hash.startsWith("register") && <RegisterPage />}
      {hash.startsWith("forgot") && <ForgotPasswordPage />}
      {hash.startsWith("insta") && <InstaClone />}
      {hash.startsWith("whatsapp") && <WhatsappClone />}
      {hash.startsWith("examples") && <Examples />}
    </>
  );
};

export default Routing;
