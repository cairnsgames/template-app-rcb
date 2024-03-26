import { useContext } from "react";
import { TenantContext } from "./tenantprovider";

export const useParams = () => {
    // get the context
    const context = useContext(TenantContext);
  
    // if `undefined`, throw an error
    if (!context) {
      throw new Error("useParams was used outside of its Provider");
    }
    const { params } = context;
    console.log("useParams update", params)
  
    return { params };
  };

