import { useContext } from "react";
import { FeatureFlagContext } from "./featureflag";

export const useFeatureFlag = () => {
    // get the context
    const context = useContext(FeatureFlagContext);
  
    // if `undefined`, throw an error
    if (!context) {
      throw new Error("useFeatureFlag was used outside of its Provider");
    }

    const { featureFlags } = context;

    const flagValue = (feature) => {
        const featureFlag = featureFlags[feature];
        return featureFlag;
    }

    const isFeatureEnabled = (feature) => {
        const featureFlag = featureFlags[feature];
        // console.log("FeatureFlag", feature, featureFlag)
        return featureFlag && (featureFlag === "Yes" || featureFlag === "yes" || featureFlag === "true" || featureFlag === "True");
    }
  
    return {featureFlags, isFeatureEnabled, flagValue};
  };

  export default useFeatureFlag;
