import React from "react";
import { useTenant } from "../../tenant/context/usetenant";
import { useParams } from "../../tenant/context/useparams";

const Summary = () => {
  const { tenant, application }= useTenant();
  const { params } = useParams();

  return (
    <div>
      <h3>Summary</h3>
      <div>Tenant Code: {tenant}</div>
      <div>
        <h3>Application</h3>
        <div>Name: {application?.name}</div>
      </div>
      <div>
        <h3>Tenant Properties</h3>
        {params.map((param) => {
          return (
            <div key={param.id}>
              {param.name}: {param.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Summary;
