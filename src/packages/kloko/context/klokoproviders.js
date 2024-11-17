import React from 'react';
import KlokoEventProvider from './klokoeventprovider';
import KlokoLocationProvider from './klokolocationprovider';

export const KlokoProviders = ({ children, user, tenant, token }) => {
  return (
    <KlokoLocationProvider user={user} tenant={tenant} token={token}>
      <KlokoEventProvider user={user} tenant={tenant} token={token}>
        {children}
      </KlokoEventProvider>
    </KlokoLocationProvider>
  );
}

export default KlokoProviders;