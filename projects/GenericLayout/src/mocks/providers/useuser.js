import { useContext } from "react";
import { AuthenticationContext } from "./authprovider"

const useUser = () => {
  const context = useContext(AuthenticationContext);

  return context;
}

export default useUser;