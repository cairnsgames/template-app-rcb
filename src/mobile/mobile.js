import MobileMain from "./mobilemain";
import useAuth from "../packages/auth/context/useauth";
import useUser from "../packages/auth/context/useuser";
import { AssistantProvider } from "./assistant/assistantprovider";
import useTenant from "../packages/tenant/context/usetenant";

const MobileApp = () => {
  const { logout, isLoggedIn } = useAuth();
  const { user, token } = useUser();
  const { tenant } = useTenant();

  return (
    <AssistantProvider user={user} token={token} tenant={tenant} >
      <MobileMain />
    </AssistantProvider>
  );
};

export default MobileApp;
