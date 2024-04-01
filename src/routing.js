import DesignElements from "./pages/design/designelements";
import useLocation from "./hooks/uselocation";
import LoginPage from "./pages/auth/loginpage";
import RegisterPage from "./pages/auth/registerpage";
import ForgotPasswordPage from "./pages/auth/forgotpasswordpage";
import InstaClone from "./apps/instaclone/instaclone";
import WhatsappClone from "./apps/whatsapp/whatsapp";
import Examples from "./getbootstrapexamples/examples";
import Container from "react-bootstrap/Container";
import TenantSummaryPage from "@cairnsgames/tenant/pages/summarypage";
import AuthSummaryPage from "./pages/auth/summarypage";
import LandingPage from "./pages/landing/landingpage";
import { useAuth } from "@cairnsgames/auth/context/useauth";
import SiteDown from "./sitedown";
import NavPart from "./parts/nav";
import EventListPage from "./pages/event/eventlistpage";
import FlagsSummaryPage from "@cairnsgames/featureflags/flagssummarypage";
import SettingsSummaryPage from "@cairnsgames/settings/settingssummarypage";
import HomePage from "./pages/home/home";
import AdminRoutes from "./pages/admin/admin";
import Router, { Route, Default } from "./packages/router/router";
import AuthPermissionsPage from "./pages/auth/permissionspage";

const Routing = () => {
  const { hash } = useLocation();
  const { isLoggedIn } = useAuth();

  if (hash.startsWith("sitedown")) {
    console.log("Show SITEDOWN");
    return <SiteDown />;
  }
  return (
    <>
      <NavPart />
      <Router>
        <Route is={"login"}>
          <LoginPage
            onSuccess={() => {
              window.location.hash = "home";
            }}
          />
        </Route>
        <Route is={"register"}>
          <RegisterPage
            onSuccess={() => {
              window.location.hash = "home";
            }}
          />
        </Route>
        <Route is={"forgot"}>
          <ForgotPasswordPage
            onSuccess={() => {
              window.location.hash = "";
            }}
          />
        </Route>
        <Route is={"logout"}>
          <LandingPage />
        </Route>

        <Route is={"tenant"}>
          <TenantSummaryPage />
        </Route>
        <Route is={"permissions"}>
          <AuthPermissionsPage />
        </Route>
        <Route is={"auth"}>
          <AuthSummaryPage />
        </Route>
        <Route is={"flags"}>
          <FlagsSummaryPage />
        </Route>
        <Route is={"settings"}>
          <SettingsSummaryPage />
        </Route>

        <Route is={"landing"}>
          <LandingPage />
        </Route>
        <Route is={""}>
          {" "}
          <HomePage />
        </Route>

        <Route if={!isLoggedIn}>
          <LandingPage />
        </Route>

        <Route startsWith={"admin"}>
          <AdminRoutes />
        </Route>
        
        <Route startsWith={"event"}><EventListPage /></Route>
        <LandingPage />
      </Router>

      {hash.startsWith("design") && (
        <Container className="mt-3">
          <DesignElements />
        </Container>
      )}
      {hash.startsWith("insta") && <InstaClone />}
      {hash.startsWith("whatsapp") && <WhatsappClone />}
      {hash.startsWith("examples") && <Examples />}
      {hash.startsWith("home") && <HomePage />}
    </>
  );
};

export default Routing;
