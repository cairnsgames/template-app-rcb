import React from "react";
import useFeatureFlag from "./usefeatureflags";

const Summary = () => {
  const { featureFlags } = useFeatureFlag();
  return (
    <div>
      <h3>Summary: Feature Flags</h3>
      {Object.keys(featureFlags).length === 0 && <div>No feature flags found</div>}
      {Object.keys(featureFlags).map((key) => (
        <div key={key}>
          <span>{key}: </span>
          <span>{featureFlags[key]}</span>
        </div>
      ))}
    </div>
  );
};

export default Summary;
