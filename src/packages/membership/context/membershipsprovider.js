import React, { createContext, useEffect, useMemo, useState } from "react";
import useTenant from "../../tenant/context/usetenant";
import useData from "../../datahooks/usedata";

const MembershipContext = createContext();

const MembershipProvider = (props) => {
  const { children, onError } = props;
  const { tenant } = useTenant();

  if (!process.env.REACT_APP_MEMBERSHIP_API) {
    throw new Error(
      "MembershipProvider: REACT_APP_MEMBERSHIP_API environment variable is required"
    );
  }

  useEffect(() => {
  }, [applications]);

  const { data: applications } = useData(
    process.env.REACT_APP_MEMBERSHIP_API + "/api.php/application",
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  const { data: users } = useData(
    process.env.REACT_APP_MEMBERSHIP_API + "/api.php/user",
    {
      headers: { "Content-Type": "application/json", APP_ID: tenant },
    }
  );

  const findApplication = (id) => {
    const application = applications.find((application) => `${application.id}` === `${id}`);
    return application;
  }

  const values = useMemo(() => ({ applications, users, findApplication }), [applications, users, findApplication]);

  return (
    <MembershipContext.Provider value={values}>
      {children}
    </MembershipContext.Provider>
  );
};

export { MembershipContext, MembershipProvider };
