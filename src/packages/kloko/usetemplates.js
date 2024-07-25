
import { useContext } from "react";
import { KlokoContext } from "./klokoprovider";

export const useTemplates = () => {
  // get the context 
  const context = useContext(KlokoContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useUser was used outside of its Provider");
  }

  const { templates, createTemplate, updateTemplate, deleteTemplate } = context;

  return { templates, createTemplate, updateTemplate, deleteTemplate };
};

export default useTemplates;
