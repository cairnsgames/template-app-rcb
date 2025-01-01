import React, { createContext, useMemo, useState } from "react";

// Create the context with a displayName and default value
const TenantContext = createContext(
  "TenantContext", // Display name
  null // Default value
);

const TenantProvider = (props) => {
  const { children, onError } = props;

  // Mock checks for props and environment variables
  if (!props.applicationId) {
    console.warn("TenantProvider: applicationId prop is required (mock warning)");
  }

  // Mock states
  const [tenant] = useState(props.applicationId || "mock-application-id");
  const configValue = props.config || { mockConfigKey: "mockConfigValue" };
  const [params, setParams] = useState(props.params || ["mockParam1", "mockParam2"]);
  const [application, setApplication] = useState({
    id: "mockApplicationId",
    name: "Mock Application",
    description: "This is a mocked application object",
  });

  // Mock side effects
  React.useEffect(() => {
    // Simulate a delay to represent fetching
    setTimeout(() => {
      console.log("Mock API call to fetch application and params");
      setApplication({
        id: "mockApplicationId",
        name: "Mock Application Updated",
        description: "Updated mock application object",
      });
      setParams(["updatedMockParam1", "updatedMockParam2"]);
    }, 1000);
  }, [tenant]);

  // Memoize the values for consistency with the original implementation
  const values = useMemo(
    () => ({ tenant, application, config: configValue, params }),
    [tenant, configValue, params]
  );

  return (
    <TenantContext.Provider value={values}>{children}</TenantContext.Provider>
  );
};

export { TenantContext, TenantProvider };
