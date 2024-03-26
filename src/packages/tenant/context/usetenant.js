import { useContext } from "react";
import { TenantContext } from "./tenantprovider.js";

export const useTenant = () => {
  // get the context
  const context = useContext(TenantContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useTenant was used outside of its Provider");
  }
  const { tenant, application } = context;

  return { tenant, application };
};

export default useTenant;
