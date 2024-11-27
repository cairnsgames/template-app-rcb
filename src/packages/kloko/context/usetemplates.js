
import { useContext } from "react";
import { KlokoEventContext } from "./klokoeventprovider";

export const useTemplates = () => {
  // get the context 
  const context = useContext(KlokoEventContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useTemplates was used outside of its Provider");
  }

  const { templates, createTemplate, updateTemplate, deleteTemplate } = context;

  return { templates, createTemplate, updateTemplate, deleteTemplate };
};

export default useTemplates;