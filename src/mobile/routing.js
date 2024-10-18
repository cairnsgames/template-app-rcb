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
import NewsSample from "../packages/news/sample";

import QRCodePage from "./pages/qrcodepage";
import MyCalendar from "./pages/mycalendar";
import ProfilePage from "../pages/profile/profilepage";
import LandingPage from "./pages/landing/landingpage";
import ComingSoon from "./pages/comingsoon";

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
        <NewsSample />
      </Route>
      <Route is={"search"}>
        <KlokoSearchPage />
      </Route>
      <Route is={"placeorder"}>
        <PlaceOrderPage />
      </Route>
      <Route is={"loyaltycarousel"} auth debug={true}>
        <LoyaltyCarousel />
      </Route>
      <Route is={"profile"}>
        <ProfilePage />
      </Route>

      <Route is="calendar">
        <ComingSoon />
      </Route>
      <Route is="store">
        <ComingSoon />
      </Route>
      <Route is="orders">
        <ComingSoon />
      </Route>
      <Route is="events">
        <ComingSoon />
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
