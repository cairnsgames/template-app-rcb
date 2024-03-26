
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

  const isLoggedIn = !!user;

  return { token, user, isLoggedIn };
};

export default useUser;
