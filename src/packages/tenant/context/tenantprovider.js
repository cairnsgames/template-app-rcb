import React, { createContext, useEffect, useMemo, useState } from "react";

// type TenantType = {
//   tenant: string;
//   config: any;
//   params: any;
//   application: any;
// };
// type TenantProviderType = {
//   children: React.ReactNode;
//   applicationId: string;
//   config: any;
//   params: any;
//   application: any;
// };

// create context
// const TenantContext = createContext<TenantType>({
//   tenant: "",
//   config: {},
//   params: [],
//   application: []
// });
const TenantContext = createContext(
  "TenantContext", // a sufficiently globally unique displayName
  null // default value
);

const TenantProvider = (props) => {
  const { children, onError } = props;

  if (!props.applicationId) {
    console.log("Env", process.env);
    throw new Error("TenantProvider: application prop is required");
  }
  if (!process.env.REACT_APP_TENANT_API) {
    throw new Error(
      "TenantProvider: REACT_APP_TENANT_API environment variable is required"
    );
  }

  const [tenant] = useState(props.applicationId);
  const configValue = props.config;
  const [params, setParams] = useState(props.params || []);
  const [application, setApplication] = useState();

  useEffect(() => {
    console.log("Params Updates", params);
  }, [params]);

  useEffect(() => {
    if (!tenant) {
      return;
    }
    console.log("TENANT CHANGE", tenant);
    fetch(process.env.REACT_APP_TENANT_API + "tenant", {
      headers: { "Content-Type": "application/json", APP_ID: tenant },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Application", data);
        if (Array.isArray(data)) {
          setApplication(data[0]);
        } else {
          setApplication(data);
        }
      })
      .catch((err) => {
        if (onError) {
          onError("Tenant: Unable to fetch Tenant details", err);
        }
      });
    fetch(process.env.REACT_APP_TENANT_API + "params", {
      headers: { "Content-Type": "application/json", APP_ID: tenant },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Params", data);
        setParams(data);
      })
      .catch((err) => {
        if (onError) {
          onError("Tenant: Unable to fetch Tenant Params",err);
        }
      });
  }, [tenant]);

  const values = useMemo(
    () => ({ tenant, application, config: configValue, params }),
    [tenant, configValue, params]
  );

  return (
    <TenantContext.Provider value={values}>{children}</TenantContext.Provider>
  );
};

export { TenantContext, TenantProvider };
