import { MobileDeviceProvider } from "./theme/modiledeviceprovider";
import { ThemeProvider } from "./theme/themeprovider";
import { TenantProvider } from "../packages/tenant/context/tenantprovider";
import { AuthenticationProvider } from "../packages/auth/context/authprovider";
import { FeatureFlagProvider } from "../packages/featureflags/featureflag";
import { SettingsProvider } from "../packages/settings/settingsprovider";
import { ToastsProvider } from "../packages/toasts/toastsprovider";

// import all providers here, so that in app.js only a single providers file need be imported
const Providers = ({ children }) => {
  const onError = (err, reason) => {
    window.location = `#sitedown?error=${err}&reason=${reason}`;
  };
  return (
    <ThemeProvider>
      <MobileDeviceProvider>
        <TenantProvider
          applicationId="b0181e17-e5c6-11ee-bb99-1a220d8ac2c9"
          onError={onError}
        >
          <AuthenticationProvider onError={onError}>
            <FeatureFlagProvider>
              <SettingsProvider>
                <ToastsProvider>{children}</ToastsProvider>
              </SettingsProvider>
            </FeatureFlagProvider>
          </AuthenticationProvider>
        </TenantProvider>
      </MobileDeviceProvider>
    </ThemeProvider>
  );
};

export default Providers;
