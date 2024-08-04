import React, { Suspense } from "react";

import Router, { Route, Default } from "../packages/router/router";
import useAuth from "../packages/auth/context/useauth";
import useLocation from "../hooks/uselocation";

import Home from "./home";
import MobileLogin from "./pages/mobilelogin";
import RegisterPage from "../packages/auth/forms/register";
import ForgotPasswordPage from "../packages/auth/forms/forgot";
import MagicLoginPage from "../pages/auth/magiccodepage";
import LandingPage from "../pages/landing/landingpage";
import LoyaltyPage from "../pages/loyalty/loyaltypage";
import UserLoyaltyPage from "../pages/loyalty/loyaltyuserpage";
import KlokoSearchPage from "../pages/fullcalendar/klokosearchpage";
import PlaceOrderPage from "../pages/breezo/placeorderpage";
import LoyaltyCarousel from "./loyalty";
import PageCentered from "../parts/pagelayouts/pagecentered";
import Tickets from "./tickets";

const MapPage = React.lazy(() => import("../pages/map/mappage"));
const AdminRoutes = React.lazy(() => import("../pages/admin/admin"));

const Routing = () => {
  const { hash } = useLocation();
  const { isLoggedIn } = useAuth();

  console.log("hash", hash);
  console.log("isLoggedIn", isLoggedIn);

  // if (hash.startsWith("sitedown")) {
  //   return <SiteDown />;
  // }
  return (
    <Router isLoggedIn={isLoggedIn} >
      <Route is={"login"}>
        <PageCentered>
        <MobileLogin
          onSuccess={() => {
            window.location.hash = "home";
          }}
        />
        </PageCentered>
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
      <Route is={"home"}>
        <Home />
      </Route>
      <Route is={"search"}>
        <KlokoSearchPage />
      </Route>
      <Route is={"placeorder"}>
        <PlaceOrderPage />
      </Route>
      <Route is={"loyaltycarousel"} auth debug={true} >
        <LoyaltyCarousel />
      </Route>
      
      <Route is={"tickets"} auth debug={true} >
        <Tickets />
      </Route>

      <Route if={!isLoggedIn}>
        <MobileLogin />
      </Route>

      <Route startsWith={"loyalty"}>
        <LoyaltyPage />
      </Route>
      <Route startsWith={"userloyalty"}>
        <UserLoyaltyPage />
      </Route>

      <Route if={!isLoggedIn}>
        <Home />
      </Route>

      <Home />
    </Router>
  );
};

export default Routing;
