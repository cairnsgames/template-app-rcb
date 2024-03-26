import { useContext } from "react";
import { TenantContext } from "./provider";

export const useConfig = () => {
    // get the context
    const context = useContext(TenantContext);
  
    // if `undefined`, throw an error
    if (!context) {
      throw new Error("useConfig was used outside of its Provider");
    }
    const { config } = context;
  
    return { config, process: config };
  };

