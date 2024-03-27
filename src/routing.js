import DesignElements from "./pages/design/designelements";
import useLocation from "./hooks/uselocation";
import LoginPage from "./pages/auth/loginpage";
import RegisterPage from "./pages/auth/registerpage";
import ForgotPasswordPage from "./pages/auth/forgotpasswordpage";
import InstaClone from "./apps/instaclone/instaclone";
import WhatsappClone from "./apps/whatsapp/whatsapp";
import Examples from "./getbootstrapexamples/examples";
import Container from "react-bootstrap/Container";
import TenantSummaryPage from "./packages/tenant/pages/summarypage";
import AuthSummaryPage from "./pages/auth/summarypage";
import LandingPage from "./pages/landing/landingpage";
import { useAuth } from "./packages/auth/context/useauth";
import SiteDown from "./sitedown";
import NavPart from "./parts/nav";
import EventListPage from "./pages/event/eventlistpage";
import FlagsSummaryPage from "./packages/featureflags/flagssummarypage";
import SettingsSummaryPage from "./packages/settings/settingssummarypage";

const Routing = () => {
  const { hash } = useLocation();
  const { isLoggedIn } = useAuth();

  console.log("#### HASH", hash)
  if (hash.startsWith("sitedown")) {
    console.log("Show SITEDOWN")
    return <SiteDown />
  }
  return (
    <>
    
    <NavPart />
      {hash.startsWith("login") && <LoginPage onSuccess={()=>{ window.location.hash="home" }} />}
      {hash.startsWith("register") && <RegisterPage onSuccess={()=>{ window.location.hash="home" }} />}
      {hash.startsWith("forgot") && <ForgotPasswordPage onSuccess={()=>{ window.location.hash="" }} />}
      {hash.startsWith("logout") && <LandingPage />}
      {hash.startsWith("tenant") && <TenantSummaryPage/>}
      {hash.startsWith("auth") && <AuthSummaryPage/>}
      {hash.startsWith("flags") && <FlagsSummaryPage />}
      {hash.startsWith("settings") && <SettingsSummaryPage />}

      {(!isLoggedIn || hash.length === 0) && <LandingPage />}

      {hash.startsWith("design") && <Container className="mt-3"><DesignElements /></Container>}
      {hash.startsWith("insta") && <InstaClone />}
      {hash.startsWith("whatsapp") && <WhatsappClone />}
      {hash.startsWith("examples") && <Examples />}
      {hash.startsWith("home") && <AuthSummaryPage/>}
      {hash.startsWith("event") && <EventListPage />}
    </>
  );
};

export default Routing;
