import React, { useEffect } from "react";
import MobileMain from "./mobilemain";
import useAuth from "../packages/auth/context/useauth";
import useUser from "../packages/auth/context/useuser";
import { AssistantProvider } from "./assistant/assistantprovider";
import useTenant from "../packages/tenant/context/usetenant";
import useTitle from "../hooks/usetitle";
import useFavicon from "../hooks/usefavicon";

const MobileApp = () => {
  const { logout, isLoggedIn } = useAuth();
  const { user, token } = useUser();
  const { tenant } = useTenant();
  useTitle("Juzt.Dance");
  useFavicon("/favicons/logo.png");

  useEffect(() => {
  }, []);

  return (
    // <AssistantProvider user={user} token={token} tenant={tenant} >
      <MobileMain />
    // </AssistantProvider>
  );
};

export default MobileApp;
