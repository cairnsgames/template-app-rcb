import React from "react";
import useSettings from "./usesettings";

const Summary = () => {
  const { settings } = useSettings();
  return (
    <div>
      <h3>Summary: Settings</h3>
      {!!(settings?.length === 0) && <div>No settings found</div>}
      {settings?.map((item, index) => {
        return (
        <div key={index.keyname}>
          <span>{item.keyname}: </span>
          <span>{item.val}</span>
        </div>
      )})}
    </div>
  );
};

export default Summary;
