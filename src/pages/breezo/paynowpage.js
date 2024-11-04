import React, { useEffect, useState } from "react";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import BreezoPayNow from "../../packages/breezo/breezopayorder";

const PayNowPage = () => {
  return (    
    <PageCentered>
        <BreezoPayNow />
    </PageCentered>
  );
};

export default PayNowPage;
