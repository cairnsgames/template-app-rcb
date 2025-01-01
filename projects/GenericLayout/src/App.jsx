import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import LandingPage from "./pages/Landing/LandingPage";
import Dashboard from "./pages/Dashboard/dashboard";
import Stats from "./pages/Stats";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Profile from "./components/Profile";
import { TenantProvider } from "./mocks/providers/tenantprovider";
import AuthenticationProvider from "./mocks/providers/authprovider";
import { ToastsProvider } from "./mocks/toasts/toastsprovider";
import useUser from "./mocks/providers/useuser";
import SettingsProvider from "./mocks/providers/settingsprovider";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useUser();
  return isLoggedIn ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <TenantProvider applicationId="5a962c6c-bfaa-11ef-b768-1a220d8ac2c9">
      <AuthenticationProvider googleClientId="mockGoogleClientId">
        <SettingsProvider>
          <ToastsProvider>
            <SubscriptionProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route
                    path="/app"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/stats"
                    element={
                      <PrivateRoute>
                        <Stats />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/alerts"
                    element={
                      <PrivateRoute>
                        <Alerts />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </Router>
            </SubscriptionProvider>
          </ToastsProvider>
        </SettingsProvider>
      </AuthenticationProvider>
    </TenantProvider>
  );
};

export default App;
