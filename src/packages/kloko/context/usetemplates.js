
import { useContext } from "react";
import { KlokoMyEventContext } from "./klokomyeventprovider";

export const useTemplates = () => {
  // get the context 
  const context = useContext(KlokoMyEventContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useTemplates was used outside of its Provider");
  }

  const { templates, addTemplate, updateTemplate, deleteTemplate } = context;

  return { templates, addTemplate, updateTemplate, deleteTemplate };
};

export default useTemplates;
