import React, { useEffect, useState } from "react";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import useGeoLocation from "../../hooks/usegeolocation";
import useGPS from "../../packages/gps/usegps";
import Calendar from "../../packages/kloko/kloko";
import PageFull from "../../parts/pagelayouts/pagefull";
import KlokoSearch from "../../packages/kloko/klokosearch";

const KlokoSearchPage = () => {
  return (    
    <PageFull>
        <KlokoSearch />
    </PageFull>
  );
};

export default KlokoSearchPage;
