
import { useContext } from "react";
import { AuthenticationContext } from "./authprovider";

export const useAuth = () => {
  // get the context
  const context = useContext(AuthenticationContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useAuth was used outside of its Provider");
  }

  const { token, register, login, logout, forgot, user, setgoogleAccessToken, changePassword } = context;

  const isLoggedIn = !!user;

  return { token, register, login, logout, forgot, user, isLoggedIn, setgoogleAccessToken, changePassword  };
};

export default useAuth;
