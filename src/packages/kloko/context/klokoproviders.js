import React from "react";
import KlokoMyEventProvider from "./klokomyeventprovider";
import KlokoLocationProvider from "./klokolocationprovider";
// import { KlokoEventsProvider } from "./klokoeventsprovider";

export const KlokoProviders = ({ children, user, tenant, token }) => {
  return (
    <KlokoLocationProvider user={user} tenant={tenant} token={token}>
      {/* <KlokoEventsProvider user={user} tenant={tenant} token={token}> */}
        <KlokoMyEventProvider user={user} tenant={tenant} token={token}>
          {children}
        </KlokoMyEventProvider>
      {/* </KlokoEventsProvider> */}
    </KlokoLocationProvider>
  );
};

export default KlokoProviders;
