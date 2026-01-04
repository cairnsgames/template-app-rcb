import React, { useEffect, useState } from "react";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import BreezoPayNow from "../../packages/breezo/breezopayorder";
import PageFull from "../../parts/pagelayouts/pagefull";

const PayNowPage = () => {
  return (    
    <PageFull className="pt-2 pagesBreezoPayNowPage">
        <BreezoPayNow />
    </PageFull>
  );
};

export default PayNowPage;
