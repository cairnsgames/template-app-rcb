
import { useContext } from "react";
import { AuthenticationContext } from "./authprovider";

export const useUser = () => {
  // get the context
  const context = useContext(AuthenticationContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useUser was used outside of its Provider");
  }

  const { token, user } = context;

  const hasAccess = (permission) => {
    console.log("!!!! PERMISSION", user)
    const access = user?.permissions?.find((p) => p.name === permission);
    console.log("!!!! ACCESS", access)
    return (access?.permission === "Yes")
  }

  const isLoggedIn = !!user;

  return { token, user, isLoggedIn, hasAccess };
};

export default useUser;
