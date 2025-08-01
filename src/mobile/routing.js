import React, { Suspense } from "react";

import Router, { Route, Default } from "../packages/router/router";
import useAuth from "../packages/auth/context/useauth";
import useLocation from "../hooks/uselocation";

import Home from "./home";
import LoyaltyPage from "../pages/loyalty/loyaltypage";
import UserLoyaltyPage from "../pages/loyalty/loyaltyuserpage";
import KlokoSearchPage from "../pages/fullcalendar/klokosearchpage";
import PlaceOrderPage from "../pages/breezo/placeorderpage";
import LoyaltyCarousel from "./loyalty";
import Tickets from "./tickets";
import MobileAuth from "./pages/mobileauth";
import NewsRouting from "../packages/news/newsrouting";

import QRCodePage from "./pages/qrcodepage";
import MyCalendar from "./pages/mycalendar";
import ProfilePage from "../pages/profile/profilepage";
import LandingPage from "./pages/landing/landingpage";
import ComingSoon from "../components/comingsoon/comingsoon";
import BreezoPayNow from "../packages/breezo/breezopayorder";
import PayNowPage from "../pages/breezo/paynowpage";
import PayNowThankYouPage from "../pages/breezo/paynowthankyoupage";
import Calendar from "../packages/kloko/kloko";
import KlokoRouting from "../packages/kloko/klokorouting";
import MagicCodePage from "../pages/auth/magiccodepage";
import BreezoMyOrders from "../packages/breezo/breezomyorders";
import BreezoMyOrderDetails from "../packages/breezo/breezomyorderdetails";
import PageFull from "../parts/pagelayouts/pagefull";
import ClassesPage from "../packages/classes/ClassesPage";
import MyClassesPage from "../packages/classes/MyClassesPage";

import ChangePasswordPage from "../pages/auth/changepasswordpage";

import './i18n';

const PartnersPage = React.lazy(() => import("./pages/partners/partners"));
const MapPage = React.lazy(() => import("../pages/map/mappage"));
const AdminRoutes = React.lazy(() => import("../pages/admin/admin"));

const Routing = () => {
  const { hash } = useLocation();
  const { isLoggedIn } = useAuth();

  // if (hash.startsWith("sitedown")) {
  //   return <SiteDown />;
  // }
  const goHome = () => {
    window.location.href = "#home";
  };
  const goProfile = () => {
    window.location.href = "#profile";
  };
  if (hash === "") {
    if (isLoggedIn) {
      return <Home />;
    }
    return <LandingPage />;
  }
  return (
    <Router isLoggedIn={isLoggedIn}>
      <Route is={"login"}>
        <MobileAuth mode="login" onSuccess={goHome} onClose={goHome} />
      </Route>
      <Route is={"logout"}>
        <Home />
      </Route>
      <Route is={"magic"}>
        <MagicCodePage />
      </Route>
      <Route is={"reset"}>
        <ChangePasswordPage />
      </Route>
      <Route is={"referral"}>
        <MobileAuth mode="register" onSuccess={goHome} onClose={goHome} />
      </Route>
      <Route is={"register"}>
        <MobileAuth mode="register" onSuccess={goHome} onClose={goHome} />
      </Route>

      <Route is={"home"}>{isLoggedIn ? <Home /> : <LandingPage />}</Route>
      <Route is={"landing"}>
        <LandingPage />
      </Route>

      <Route startsWith={"news"}>
        <NewsRouting />
      </Route>
      <Route is={"search"}>
        <KlokoSearchPage />
      </Route>
      
      <Route is="calendar">
        <MyClassesPage />
      </Route>
      <Route is={"classes"}>
        <ClassesPage />
      </Route>
      <Route is={"placeorder"}>
        <PlaceOrderPage />
      </Route>

      <Route is={"payorder/thankyou"}>
        <PayNowThankYouPage />
      </Route>
      <Route is={"payorder/{id}"}>
        <PayNowPage />
      </Route>

      <Route is={"loyaltycarousel"} auth debug={true}>
        <LoyaltyCarousel />
      </Route>
      <Route is={"profile"}>
        <ProfilePage />
      </Route>

      <Route is="store">
        <ComingSoon />
      </Route>
      <Route is="orders">
        <PageFull>
          <BreezoMyOrders />
        </PageFull>
      </Route>

      <Route is="orders/{id}">
          <BreezoMyOrderDetails />
      </Route>
      <Route startsWith="events">
        <KlokoRouting />
      </Route>
      <Route startsWith="myevents">
        <KlokoRouting />
      </Route>
      <Route is="locations">
        <KlokoRouting />
      </Route>

      <Route if={!isLoggedIn}>
        <MobileAuth mode="login" onClose={goHome} />
      </Route>

      <Route is={"tickets"} auth debug={true}>
        <Tickets />
      </Route>
      <Route startsWith={"loyalty"}>
        <LoyaltyPage />
      </Route>
      <Route startsWith={"partner"}>
        <PartnersPage />
      </Route>

      <Route startsWith={"map"}>
        <MapPage />
      </Route>
      <Route startsWith={"userloyalty"}>
        <UserLoyaltyPage />
      </Route>
      <Route startsWith={"qrcode"}>
        <QRCodePage />
      </Route>
      <Route startsWith={"mycalendar"}>
        <MyCalendar />
      </Route>

      <Route if={!isLoggedIn}>
        <Home />
      </Route>

      <Home />
    </Router>
  );
};

export default Routing;
