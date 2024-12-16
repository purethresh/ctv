"use client";

import SServiceInfo from "../components/SServiceInfo";
import { useState, useEffect } from 'react';
import { getDayString, getDefaultSunday } from "../lib/dateUtils";
import SServiceAdd from "../components/SServiceAdd";
import SChurchCalendar from "../components/SChurchCalendar";
import UserInfo from "../lib/UserInfo";
import { IServiceInfo, ServiceInfo } from "../lib/ServiceInfo";

export default function SchedulePage() {
  let [curentDate, setCurrentDate] = useState<string>(getDefaultSunday());
  let [currentTime, setCurrentTime] = useState<Date>(new Date(getDefaultSunday()));
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
  let [serviceList, setServiceList] = useState<ServiceInfo[]>([]);
  let [updateScheduleNum, setUpdateScheduleNum] = useState<number>(0);

  const onDateChange = async (dt:Date) => {
    await loadServiceInfo(dt);

    setCurrentTime(dt);
    setCurrentDate(getDayString(dt));
  }

  const onMonthChange = async (month:string, year:string) => {
    
  }

  const onServiceCreated = async () => {
    // Need to reload list of scheduled services
    setUpdateScheduleNum(updateScheduleNum + 1);

    // Reload the service info without using the cache
    await loadServiceInfo(currentTime, false);
  }

  const loadServiceInfo = async(dt:Date, useCache:boolean = true) => {
    const opt = useCache ? { cache: 'force-cache' } as RequestInit : undefined;
    const res = await fetch(`/api/services?church_id=${userInfo.church_id}&year=${dt.getFullYear()}&month=${dt.getMonth()+1}&day=${dt.getDate().toString()}`, opt);
    const result = await res.json();

    const lst = [];
    for(var i=0; i<result.length; i++) {
      const data = result[i];
      const s = new ServiceInfo(data as IServiceInfo);
      lst.push(s);
    }

    setServiceList(lst);
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
      <SChurchCalendar defaultDate={curentDate} onDateChanged={onDateChange} churchId={userInfo.church_id} updateNumber={updateScheduleNum} onMonthChanged={onMonthChange} />
      <SServiceAdd defaultDate={currentTime} onCreateService={onServiceCreated} church_id={userInfo.church_id} />
      {serviceList.map((item, index) => (
        <SServiceInfo key={item.service_id} serviceInfo={item}  />
      ))}
    </>  
  );
}


