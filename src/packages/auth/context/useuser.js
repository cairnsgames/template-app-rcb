import { useContext } from "react";
import { AuthenticationContext } from "./authprovider";

export const useUser = () => {
  // get the context
  const context = useContext(AuthenticationContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useUser was used outside of its Provider");
  }

  const { token, user, properties, saveProperties } = context;

  const hasAccess = (permission) => {
    const access = user?.permissions?.find((p) => p.name === permission);
    return access?.permission === "YES";
  };

  const isLoggedIn = !!user;

  const getPropertyValue = (name) => {
    const prop = properties?.find((p) => p.name === name);
    return prop?.value;
  };

  const getIdWithChecksum = () => {
    if (!user) {
      return null;
    }
    // Ensure id is treated as a string
    const idStr = user.id.toString();

    // Calculate checksum
    let sum = 0;
    for (let i = 0; i < idStr.length; i++) {
      sum += parseInt(idStr[i]);
    }

    // Make sure the checksum never starts with 0
    let checksum = (sum % 90) + 10;

    // Construct the expanded ID
    let expandedId = `${checksum}${idStr.padStart(4, "0")}`;

    return expandedId;
  };
  const fullId = getIdWithChecksum();

  return {
    token,
    user,
    fullId,
    isLoggedIn,
    hasAccess,
    properties,
    getPropertyValue,
    saveProperties,
  };
};

export default useUser;
