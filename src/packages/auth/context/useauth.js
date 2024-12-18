
import { useContext } from "react";
import { AuthenticationContext } from "./authprovider";

export const useAuth = () => {
  // get the context
  const context = useContext(AuthenticationContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useAuth was used outside of its Provider");
  }

  const { token, register, login, requestMagicLink, loginWithMagicLink, logout, forgot, user, setgoogleAccessToken, changePassword, impersonate } = context;

  const isLoggedIn = !!user;

  return { token, register, login, requestMagicLink, loginWithMagicLink, logout, forgot, user, isLoggedIn, setgoogleAccessToken, changePassword, impersonate };
};

export default useAuth;
