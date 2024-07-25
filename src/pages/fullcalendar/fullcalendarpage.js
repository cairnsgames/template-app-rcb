import React, { useEffect, useState } from "react";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import useGeoLocation from "../../hooks/usegeolocation";
import useGPS from "../../packages/gps/usegps";
import Calendar from "../../packages/kloko/kloko";
import PageFull from "../../parts/pagelayouts/pagefull";

const FullCalendarPage = () => {
  return (    
    <PageFull style={{ margin: "1rem" }}>
        <h1>Event Calendar</h1>
        <Calendar />
    </PageFull>
  );
};

export default FullCalendarPage;
