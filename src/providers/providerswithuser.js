import React from "react";
import { KlokoProviders } from "../packages/kloko/context/klokoproviders";
import { useUser } from "../packages/auth/context/useuser";
import { useTenant } from "../packages/tenant/context/usetenant";
import BreezoProvider from "../packages/breezo/context/breezoprovider";
import { FeatureFlagProvider } from "../packages/featureflags/featureflag";
import SettingsProvider from "../packages/settings/settingsprovider";
import useSettings from "../packages/settings/usesettings";
import useFeatureFlag from "../packages/featureflags/usefeatureflags";
import { NewsProvider } from "../packages/news/context/newscontext";
import { TrackerProvider } from "../packages/tracker/trackercontext";

const ProvidersWithSettingsAndFeatures = ({
  children,
  user,
  tenant,
  token,
}) => {
  return (
    <KlokoProviders
      user={user}
      tenant={tenant}
      token={token}
      useSettings={useSettings}
      useFeatureFlag={useFeatureFlag}
    >
      <BreezoProvider
        user={user}
        tenant={tenant}
        token={token}
        useSettings={useSettings}
        useFeatureFlag={useFeatureFlag}
      >
        <NewsProvider>{children}</NewsProvider>
      </BreezoProvider>
    </KlokoProviders>
  );
};

const ProvidersWithUser = ({ children }) => {
  const { user, token } = useUser();
  const { tenant } = useTenant();

  return (
    <FeatureFlagProvider user={user} tenant={tenant} token={token}>
      <SettingsProvider user={user} tenant={tenant} token={token}>
        <TrackerProvider>
          <ProvidersWithSettingsAndFeatures
            user={user}
            tenant={tenant}
            token={token}
          >
            {children}
          </ProvidersWithSettingsAndFeatures>
        </TrackerProvider>
      </SettingsProvider>
    </FeatureFlagProvider>
  );
};

export default ProvidersWithUser;
