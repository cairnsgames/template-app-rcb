import { useContext } from "react";
import { FeatureFlagContext } from "./featureflag";

export const useFeatureFlag = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error("useFeatureFlag was used outside of its Provider");
  }
  const { featureFlags } = context;

  const flagValue = (feature: string): string | undefined => featureFlags[feature];

  const isFeatureEnabled = (feature: string): boolean => {
    const val = featureFlags[feature];
    return !!(val && (val === "Yes" || val === "yes" || val === "true" || val === "True"));
  };

  return { featureFlags, isFeatureEnabled, flagValue };
};

export default useFeatureFlag;
