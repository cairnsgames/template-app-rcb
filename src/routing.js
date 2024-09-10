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
import ContentPage from "./pages/contentpage";
import ContentPage2 from "./pages/contentpage2";
import NewContentPage from "./pages/newcontentpage";
import GeoLocationPage from "./pages/geolocation/geolocationpage";
import QRCodePage from "./pages/qrcode/qrcodepage";
import ReviewPage from "./pages/reviewpage";
import TourPage from "./pages/tourpage";
import FormPage from "./pages/form/formpage";
import DocsPage from "./pages/doc/docspage";
import APITestPage from "./pages/apitest/apitestpage";
import WizardPage from "./pages/wizard/wizardpage.js";
import TranslationPage from "./pages/translationpage.js";
import MagicLoginPage from "./pages/auth/magiccodepage.js";
import LoyaltyPage from "./pages/loyalty/loyaltypage.js";
import UserLoyaltyPage from "./pages/loyalty/loyaltyuserpage.js";
import FullCalendarPage from "./pages/fullcalendar/fullcalendarpage.js";
import KlokoSearchPage from "./pages/fullcalendar/klokosearchpage.js";
import PlaceOrderPage from "./pages/breezo/placeorderpage.js";
import ProfilePage from "./pages/profile/profilepage.js";

const MapPage = React.lazy(() => import("./pages/map/mappage"));
const AdminRoutes = React.lazy(() => import("./pages/admin/admin"));

const Routing = () => {
  const { hash } = useLocation();
  const { isLoggedIn } = useAuth();

  if (hash.startsWith("sitedown")) {
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
        <Route is={"magic"}>
          <MagicLoginPage />
        </Route>
        <Route is={"logout"}>
          <LandingPage />
        </Route>
        <Route is={"calendar"}>
          <FullCalendarPage />
        </Route>
        <Route is={"eventsearch"}>
          <KlokoSearchPage />
        </Route>

        <Route is={"placeorder"}>
          <PlaceOrderPage />
        </Route>

        <Route is={"content/{id}"}>
          <ContentPage />
        </Route>
        <Route is={"trans"}>
          <TranslationPage />
        </Route>

        <Route is={"tour"}>
          <TourPage />
        </Route>


        <Route is={"profile"}>
          <ProfilePage />
        </Route>        
        <Route startsWith={"loyalty"}>
          <LoyaltyPage />
        </Route>
        <Route startsWith={"userloyalty"}>
          <UserLoyaltyPage />
        </Route>

        <Route is={"pagecontent/{id}"}>
          <ContentPage2 />
        </Route>
        <Route is={"newcontent"}>
          <NewContentPage />
        </Route>

        <Route is={"wizard"}>
          <WizardPage />
        </Route>
        <Route is={"tenant"}>
          <TenantSummaryPage />
        </Route>

        <Route is={"form"}>
          <FormPage />
        </Route>
        <Route is={"doc"}>
          <DocsPage />
        </Route>
        <Route is={"geolocation"}>
          <GeoLocationPage />
        </Route>
        <Route is={"review"}>
          <ReviewPage />
        </Route>
        <Route is={"map"}>
          <Suspense fallback={<div>Loading...</div>}>
            <MapPage />
          </Suspense>
        </Route>
        <Route is={"apitest"}>
          <Suspense fallback={<div>Loading...</div>}>
            <APITestPage />
          </Suspense>
        </Route>
        <Route is={"qrcode"}>
          <QRCodePage />
        </Route>
        <Route is={"permissions"}>
          <AuthPermissionsPage />
        </Route>
        <Route is={"user"}>
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
