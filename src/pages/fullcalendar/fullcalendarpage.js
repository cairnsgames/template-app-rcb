import React, { useEffect, useState } from "react";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import useGeoLocation from "../../hooks/usegeolocation";
import useGPS from "../../packages/gps/usegps";
import Calendar from "../../packages/kloko/kloko";
import PageFull from "../../parts/pagelayouts/pagefull";

const FullCalendarPage = () => {
  return (    
    <PageFull className="pagesFullCalendarPage">
        <h1>Event Calendar</h1>
        <Calendar />
    </PageFull>
  );
};

export default FullCalendarPage;
