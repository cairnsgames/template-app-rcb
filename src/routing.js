import React, { Suspense } from "react";

import NavPart from "./parts/nav";
import Router, { Route, Default } from "./packages/router/router";
import useAuth from "@cairnsgames/auth/context/useauth";
import useLocation from "./hooks/uselocation";

import DesignElements from "./pages/design/designelements";
import LoginPage from "./pages/auth/loginpage";
import RegisterPage from "./pages/auth/registerpage";
import ForgotPasswordPage from "./pages/auth/forgotpasswordpage";
import InstaClone from "./apps/instaclone/instaclone";
import WhatsappClone from "./apps/whatsapp/whatsapp";
import Examples from "./getbootstrapexamples/examples";
import TenantSummaryPage from "@cairnsgames/tenant/pages/summarypage";
import AuthSummaryPage from "./pages/auth/summarypage";
import LandingPage from "./pages/landing/landingpage";
import SiteDown from "./sitedown";
import EventListPage from "./pages/event/eventlistpage";
import FlagsSummaryPage from "@cairnsgames/featureflags/flagssummarypage";
import SettingsSummaryPage from "@cairnsgames/settings/settingssummarypage";
import AuthPermissionsPage from "./pages/auth/permissionspage";
import HomePage from "./pages/home/home";
import ContentPage from "./pages/home/contentpage";
import GeoLocationPage from "./pages/geolocation/geolocationpage";
import QRCodePage from "./pages/qrcode/qrcodepage";

const AdminRoutes = React.lazy(() => import("./pages/admin/admin"));

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

        <Route is={"content/{id}"}>
          <ContentPage />
        </Route>

        <Route is={"tenant"}>
          <TenantSummaryPage />
        </Route>
        
        <Route is={"geolocation"}>
          <GeoLocationPage />
        </Route>
        <Route is={"qrcode"}>
          <QRCodePage />
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
          <HomePage />
        </Route>
        <Route is={"home"}>
          <HomePage />
        </Route>

        <Route if={!isLoggedIn}>
          <LandingPage />
        </Route>

        <Route startsWith={"admin"}>
          <Suspense fallback={<div>Loading...</div>}>
            <AdminRoutes />
          </Suspense>
        </Route>

        <Route startsWith={"event"}>
          <EventListPage />
        </Route>

        <Route startsWith={"design"}>
          <DesignElements />
        </Route>
        <Route startsWith={"insta"}>
          <InstaClone />
        </Route>
        <Route startsWith={"whatsapp"}>
          <WhatsappClone />
        </Route>
        <Route startsWith={"examples"}>
          <Examples />
        </Route>

        <LandingPage />
      </Router>
    </>
  );
};

export default Routing;
