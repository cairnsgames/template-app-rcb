import React from "react";
import useFeatureFlag from "./usefeatureflags";

const Summary = () => {
  const { featureFlags } = useFeatureFlag();
  console.log("!!FLAGS!!", featureFlags)
  return (
    <div>
      <h3>Summary: Feature Flags</h3>
      {!!(featureFlags?.length === 0) && <div>No feature flags found</div>}
      {Object.keys(featureFlags).length === 0 && <div>No feature flags found</div>}
      {Object.keys(featureFlags).map((key, index) => (
        <div key={key}>
          <span>{key}: </span>
          <span>{featureFlags[key]}</span>
        </div>
      ))}
    </div>
  );
};

export default Summary;
