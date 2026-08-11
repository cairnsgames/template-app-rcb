import React, { createContext, useEffect, useState, useMemo } from "react";
import { logUntypedResponse } from "../../functions/loguntypedresponse";
import { FeatureFlags, FeatureFlagContextValue, GetFeatureFlagsResponse } from "./featureflags.types";

export const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(undefined);

type FeatureFlagProviderProps = {
  tag?: string;
  children: React.ReactNode;
  user?: { id?: number; accountlevel?: string; admin?: boolean };
  tenant?: string;
  token?: string;
};

export const FeatureFlagProvider = ({ tag, children, user, tenant }: FeatureFlagProviderProps) => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({});

  if (!process.env.REACT_APP_FLAGS_API) {
    throw new Error("FeatureFlagProvider: REACT_APP_FLAGS_API environment variable is required");
  }

  useEffect(() => {
    const body = {
      userid: user?.id,
      accountlevel: user?.accountlevel,
      admin: user?.admin,
    };
    fetch(`${process.env.REACT_APP_FLAGS_API}/getfeatureflags.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", APP_ID: tenant ?? "" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        const typed = logUntypedResponse<GetFeatureFlagsResponse>("featureflag.getfeatureflags", data);
        setFeatureFlags(typed.result ?? {});
      })
      .catch(() => {
        setFeatureFlags({});
      });
  }, [tag, user]);

  const values = useMemo(() => ({ featureFlags }), [featureFlags]);

  return (
    <FeatureFlagContext.Provider value={values}>
      {children}
    </FeatureFlagContext.Provider>
  );
};
