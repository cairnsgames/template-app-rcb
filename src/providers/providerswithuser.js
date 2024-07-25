import React from 'react';
import { KlokoProvider } from '../packages/kloko/klokoprovider';
import { useUser } from '../packages/auth/context/useuser';
import { useTenant } from '../packages/tenant/context/usetenant';
const ProvidersWithUser = ({ children }) => {
    const { user, token } = useUser();
    const { tenant } = useTenant();

    console.log("TOKEN!!!!!!!!!!!!", token)

    return <KlokoProvider user={user} tenant={tenant} token={token}>
        {children}
        </KlokoProvider>;
}

export default ProvidersWithUser;