"use client";

import SServiceInfo from "../components/SServiceInfo";
import { useState, useEffect } from 'react';
import { getDayString, getDefaultSunday } from "../lib/DateUtils";
import SServiceAdd from "../components/SServiceAdd";
import SChurchCalendar from "../components/SChurchCalendar";
import UserInfo from "../lib/UserInfo";
import { ServiceInfo } from "../lib/ServiceInfo";
import { Grid2 } from "@mui/material";
import { SchedulePageData } from "../db/SchedulePageData";
import ChurchLabels from "../lib/ChurchLabels";
import { ChurchSchedule } from "../lib/ChurchSchedule";

export default function SchedulePage() {
  let [pageData, setPageData] = useState<SchedulePageData>(new SchedulePageData());
  let [allLabels, setAllLabels] = useState<ChurchLabels>(new ChurchLabels());
  let [schedule, setSchedule] = useState<ChurchSchedule>(new ChurchSchedule(''));
  
  let [curentDate, setCurrentDate] = useState<string>(getDefaultSunday());
  let [currentTime, setCurrentTime] = useState<Date>(new Date(getDefaultSunday()));
  let [scheduledDays, setScheduledDays] = useState<number[]>([]);
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
  let [serviceList, setServiceList] = useState<ServiceInfo[]>([]);

  const onDateChange = async (dt:Date) => {
    setCurrentTime(dt);
    setCurrentDate(getDayString(dt));

    const pData = pageData;
    await pData.loadServiceForDay(dt.getFullYear(), dt.getMonth()+1, dt.getDate());

    setServiceList(pData.serviceList);
    setPageData(pData);
  }

  const onMonthChange = async (dt:Date) => {
    const pData = pageData;
    await pData.loadServiceForDay(dt.getFullYear(), dt.getMonth()+1, dt.getDate());
    await loadMonthSchedule(pData, dt);

    setServiceList(pData.serviceList);
    setPageData(pData);
  }

  const onServiceCreated = async (sInfo:ServiceInfo) => {
    const pData = pageData;
    await pData.createService(sInfo);
    await pData.loadServiceForDay(currentTime.getFullYear(), currentTime.getMonth()+1, currentTime.getDate());

    await loadMonthSchedule(pData, currentTime);

    setServiceList(pData.serviceList);
    setPageData(pData);
  }

  const loadMonthSchedule = async (pData:SchedulePageData, dt:Date) => {
    await pData.loadServicesWithBufferDays(dt);

    setScheduledDays(pData.schedule.getMonthlySchedule());
  }

  const onAddMemberToSchedule = async (info:any, sTime:Date) => {
    await pageData.addMemberToService(info);
    // TODO JLS, need to get members for service
    // {service_id: sId, label_id: lId, member_id: mId}    
    // await pageData.loadScheduleWithBufferDays(sTime);

    // setPageData(pageData);
  }

  const onRemoveMemberFromSchedule = async (info:any, sTime:Date) => {
    await pageData.removeMemberFromService(info);
    // TODO JLS, need to get members for service
    // {service_id: sId, label_id: lId, member_id: mId}
    // await pageData.loadScheduleWithBufferDays(sTime);

    // setPageData(pageData);
  }

  useEffect(() => {
    const getServiceInfo = async() => {
      // Load member info
      const pData = pageData;
      await pData.loadMemberInfo();
      setUserInfo(pData.uInfo);

      // Load the service info
      await pData.loadServiceForDay(currentTime.getFullYear(), currentTime.getMonth()+1, currentTime.getDate());

      // Load the labels
      await pData.loadChurchLabels();
      await pData.loadMembersForScheduledLabels();

      // Load the schedule
      await loadMonthSchedule(pData, currentTime);

      // Get members for the scheduled labels
      for (var i=0; i<pData.serviceList.length; i++) {
        const sInfo = pData.serviceList[i];
        await pData.loadScheduledLabels(sInfo.service_id);
      }

      setServiceList(pData.serviceList);
      setAllLabels(pData.churchLabels);
      setSchedule(pData.schedule);
      
      setPageData(pData);
    }

    getServiceInfo();
  }, []);

  return (
    <Grid2 container spacing={2}>
      <SChurchCalendar defaultDate={curentDate} onDateChanged={onDateChange} onMonthChanged={onMonthChange} scheduledDays={scheduledDays} />
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <SServiceAdd defaultDate={currentTime} onCreateService={onServiceCreated} church_id={userInfo.church_id} />
      </Grid2>
      {serviceList.map((item, index) => (
        <Grid2 size={12} key={item.service_id + '_grid'}>
          <SServiceInfo key={item.service_id} churchLabels={allLabels} schedule={schedule} serviceInfo={item} onAddMemberToSchedule={onAddMemberToSchedule} onRemoveMemberFromSchedule={onRemoveMemberFromSchedule} />
        </Grid2>
      ))}
    </Grid2>  
  );
}


