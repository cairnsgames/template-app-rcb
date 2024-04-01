
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
    const access = user?.permissions?.find((p) => p.name === permission);
    return (access?.permission === "YES")
  }

  const isLoggedIn = !!user;

  return { token, user, isLoggedIn, hasAccess };
};

export default useUser;
