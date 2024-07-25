import { MobileDeviceProvider } from "../packages/device/mobiledeviceprovider";
import { ThemeProvider } from "./theme/themeprovider";
import { TenantProvider } from "../packages/tenant/context/tenantprovider";
import { AuthenticationProvider } from "../packages/auth/context/authprovider";
import { FeatureFlagProvider } from "../packages/featureflags/featureflag";
import { SettingsProvider } from "../packages/settings/settingsprovider";
import { ToastsProvider } from "../packages/toasts/toastsprovider";
import MapProvider from "../packages/map/context/mapprovider";
import TranslationProvider from "../packages/translation/translationprovider";
import { GPSProvider } from "../packages/gps/gpsprovider";
import ProvidersWithUser from "./providerswithuser";

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
          <TranslationProvider defaultLocale="en" locale="en">
            <AuthenticationProvider
              onError={onError}
              googleClientId="284541609551-mnsvu7bi9medujkp0hdap87b1pvqjaa8.apps.googleusercontent.com"
            >
              <FeatureFlagProvider>
                <SettingsProvider>
                  <ToastsProvider>
                    <GPSProvider>
                      <ProvidersWithUser>
                        <MapProvider>{children}</MapProvider>
                      </ProvidersWithUser>
                    </GPSProvider>
                  </ToastsProvider>
                </SettingsProvider>
              </FeatureFlagProvider>
            </AuthenticationProvider>
          </TranslationProvider>
        </TenantProvider>
      </MobileDeviceProvider>
    </ThemeProvider>
  );
};

export default Providers;
