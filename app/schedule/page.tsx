"use client";

import SServiceCalendar from "../components/SServiceCalendar";
import SServiceInfo from "../components/SServiceInfo";
import { useState, useEffect } from 'react';
import { getDefaultSunday } from "../lib/dateUtils";
import SServiceAdd from "../components/SServiceAdd";

// TODO JLS - Here
// Hook up nav to this page
// Start working on this page.
// Need a control for all services on a specific day
// Then show labels for each service.
// Make it so a service can be minimized and expanded

export default function SchedulePage() {
  let [currentTime, setCurrentTime] = useState<Date>(new Date(getDefaultSunday()));

  const onServiceCreated = () => {
    // TODO JLS
    // Need to reload list of services
  }

  useEffect(() => {
    // TODO JLS
  }, []);

  return (
    <>
    <SServiceCalendar />
    <SServiceAdd defaultDate={currentTime} onCreateService={onServiceCreated} />
    This should be a list of service info
    <SServiceInfo />
    </>  
  );
}