import React from "react";
import { KlokoProvider } from "../packages/kloko/klokoprovider";
import { useUser } from "../packages/auth/context/useuser";
import { useTenant } from "../packages/tenant/context/usetenant";
import BreezoProvider from "../packages/breezo/context/breezoprovider";

const ProvidersWithUser = ({ children }) => {
  const { user, token } = useUser();
  const { tenant } = useTenant();

  console.log("TOKEN!!!!!!!!!!!!", token);

  return (
    <KlokoProvider user={user} tenant={tenant} token={token}>
      <BreezoProvider user={user} tenant={tenant} token={token}>
        {children}
      </BreezoProvider>
    </KlokoProvider>
  );
};

export default ProvidersWithUser;
