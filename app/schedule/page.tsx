"use client";

import SServiceInfo from "../components/SServiceInfo";
import { useState, useEffect } from 'react';
import { getDayString, getDefaultSunday } from "../lib/dateUtils";
import SServiceAdd from "../components/SServiceAdd";
import SChurchCalendar from "../components/SChurchCalendar";
import UserInfo from "../lib/UserInfo";

// TODO JLS - Here
// Need a control for all services on a specific day
// Then show labels for each service.
// Make it so a service can be minimized and expanded

export default function SchedulePage() {
  let [curentDate, setCurrentDate] = useState<string>(getDefaultSunday());
  let [currentTime, setCurrentTime] = useState<Date>(new Date(getDefaultSunday()));
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());

  const onDateChange = async (dt:Date) => {
    await loadServiceInfo(dt);

    setCurrentTime(dt);
    setCurrentDate(getDayString(dt));
  }

  const onServiceCreated = () => {
    // TODO JLS
    // Need to reload list of services
  }

  const loadServiceInfo = async(dt:Date) => {
    const res = await fetch(`/api/services?church_id=${userInfo.church_id}&year=${dt.getFullYear()}&month=${dt.getMonth()+1}&day=${dt.getDate().toString().padStart(2, '0')}`);
    const result = await res.json();

    // TODO JLS, show the list of services
  }

  useEffect(() => {
    const getUserInfo = async() => {
      const uInfo = new UserInfo();    
      await uInfo.loadMemberInfo();
      setUserInfo(uInfo);

      loadServiceInfo(currentTime);
    }    

    getUserInfo();
  }, []);

  return (
    <>
      <SChurchCalendar defaultDate={curentDate} onDateChanged={onDateChange} churchId={userInfo.church_id} />
      <SServiceAdd defaultDate={currentTime} onCreateService={onServiceCreated} church_id={userInfo.church_id} />
      This should be a list of service info
      <SServiceInfo />
    </>  
  );
}


