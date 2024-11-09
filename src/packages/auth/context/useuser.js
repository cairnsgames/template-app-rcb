import { useContext } from "react";
import { AuthenticationContext } from "./authprovider";

export const useUser = () => {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error("useUser was used outside of its Provider");
  }

  const { token, user, saveUser, properties, saveProperties, oldIdToNewMapping } = context;

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
    if (!user?.id) {
      return null;
    }
    const idStr = user.id.toString();

    let sum = 0;
    for (let i = 0; i < idStr.length; i++) {
      sum += parseInt(idStr[i]);
    }

    let checksum = (sum % 90) + 10;

    let expandedId = `${checksum}${idStr.padStart(4, "0")}`;

    return expandedId;
  };
  const fullId = getIdWithChecksum();

  const getIdFromFullId = (fullId) => {
    if (!fullId || fullId.length < 6) {
      return fullId;
    }
  
    console.log("fullId", fullId);
    const checksum = parseInt(fullId.slice(0, 2));
    console.log("checksum", checksum);
    const idStr = fullId.slice(2);
    console.log("idStr", idStr);
  
    let sum = 0;
    for (let i = 0; i < idStr.length; i++) {
      sum += parseInt(idStr[i]);
    }
    let recalculatedChecksum = (sum % 90) + 10;
  
    if (checksum === recalculatedChecksum) {
      return parseInt(idStr).toString();
    } else {
      return undefined;
    }
  };

  return {
    token,
    user,
    saveUser,
    fullId,
    oldIdToNewMapping,
    getIdFromFullId,
    isLoggedIn,
    hasAccess,
    properties,
    getPropertyValue,
    saveProperties,
  };
};

export default useUser;
