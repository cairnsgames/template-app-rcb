import React, { createContext, useEffect, useState, useMemo } from "react";

const FeatureFlagContext = createContext({ featureFlags: []});

const FeatureFlagProvider = ( props, user, tenant, token ) => {
  const { tag, children } = props;

  const [featureFlags, setFeatureFlags] = useState([]);

  if (!process.env.REACT_APP_FLAGS_API) {
    throw new Error("AuthProvider: REACT_APP_FLAGS_API environment variable is required");
  }

  useEffect(() => {
    const body = {
      "userid": user?.id,
      "accountlevel": user?.accountlevel,
      "admin": user?.admin,
    }
    fetch(`${process.env.REACT_APP_FLAGS_API}/getfeatureflags.php`, 
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "APP_ID": tenant  },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        setFeatureFlags(data.result);
      })
      .catch((err) => {
        setFeatureFlags([]);
      });
  }, [tag, user]);

  const values = useMemo(
    () => ({
      featureFlags
    }),
    [featureFlags]
  );  

  return (
    <FeatureFlagContext.Provider value={values}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export { FeatureFlagContext, FeatureFlagProvider }