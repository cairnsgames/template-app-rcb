import React from "react";
import { KlokoProvider } from "../packages/kloko/klokoprovider";
import { useUser } from "../packages/auth/context/useuser";
import { useTenant } from "../packages/tenant/context/usetenant";
import BreezoProvider from "../packages/breezo/context/breezoprovider";
import { FeatureFlagProvider } from "../packages/featureflags/featureflag";
import SettingsProvider from "../packages/settings/settingsprovider";
import useSettings from "../packages/settings/usesettings";
import useFeatureFlag from "../packages/featureflags/usefeatureflags";

const ProvidersWithSettingsAndFeatures = ({
  children,
  user,
  tenant,
  token,
}) => {

  return (
    <KlokoProvider user={user} tenant={tenant} token={token} useSettings={useSettings} useFeatureFlag={useFeatureFlag}>
      <BreezoProvider user={user} tenant={tenant} token={token} useSettings={useSettings} useFeatureFlag={useFeatureFlag}>
        {children}
      </BreezoProvider>
    </KlokoProvider>
  );
};

const ProvidersWithUser = ({ children }) => {
  const { user, token } = useUser();
  const { tenant } = useTenant();

  return (
    <FeatureFlagProvider user={user} tenant={tenant} token={token}>
      <SettingsProvider user={user} tenant={tenant} token={token}>
        <ProvidersWithSettingsAndFeatures user={user} tenant={tenant} token={token}>
          {children}
        </ProvidersWithSettingsAndFeatures>
      </SettingsProvider>
    </FeatureFlagProvider>
  );
};

export default ProvidersWithUser;
