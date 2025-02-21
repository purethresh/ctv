"use client";

import { useState, useEffect } from 'react';
import { getDefaultSunday } from "../lib/DateUtils";
import SServiceAdd from "../components/SServiceAdd";
import SChurchCalendar from "../components/SChurchCalendar";
import UserInfo from "../lib/UserInfo";
import { ServiceInfo } from "../lib/ServiceInfo";
import { Grid2 } from "@mui/material";
import { SchedulePageData } from "../db/SchedulePageData";
import { ChurchSchedule } from "../lib/ChurchSchedule";
import { getDayString } from "../lib/DateUtils";
import SServiceInfo from "../components/SServiceInfo";
import { API_CALLS, APIHandler } from '../lib/APIHandler';
import { FullMemberInfo } from '../lib/FullMemberInfo';

export default function SchedulePage() {
  let [pageData, setPageData] = useState<SchedulePageData>(new SchedulePageData());
  let [scheduleList, setScheduleList] = useState<ChurchSchedule[]>([]);
  let [scheduledDays, setScheduledDays] = useState<number[]>([]);
  
  let [curentDate, setCurrentDate] = useState<string>(getDefaultSunday());
  let [currentTime, setCurrentTime] = useState<Date>(new Date(getDefaultSunday()));
  let [currentSchedule, setCurrentSchedule] = useState<ChurchSchedule[]>([]);

  let [memberMap, setMemberMap] = useState<Map<string, FullMemberInfo>>(new Map<string, FullMemberInfo>());
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());

  const onDateChange = async (dt:Date) => {
    setCurrentTime(dt);
    setCurrentDate(getDayString(dt));

    // The schedule should already be loaded, we just need to show it.
    var cSchedule:ChurchSchedule[] = [];
    const pData = pageData;
    for (var i=0; i<scheduleList.length; i++) {
      const sInfo = scheduleList[i];
      if (sInfo.serviceInfo.serviceAsDate().getDate() == dt.getDate()) {
        cSchedule.push(sInfo);
      }
    }

    setCurrentSchedule(cSchedule);
    setMemberMap(pData.memberMap);
  }

  const onMonthChange = async (dt:Date) => {
    const pData = pageData;
    await pData.loadServiceForDay(dt.getFullYear(), dt.getMonth()+1, dt.getDate());

    await loadServicesForMonth(pageData, dt);

    setScheduleList(pData.scheduleList);
    setPageData(pData);
  }

  const onServiceCreated = async (sInfo:ServiceInfo) => {
    const pData = pageData;
    await pData.createService(sInfo);

    await loadServicesForMonth(pData, currentTime);
    setPageData(pData);
  }

  const loadServicesForMonth = async (pData:SchedulePageData, dt:Date) => {
      // Load the services for the month
      await pData.loadServicesWithBufferDays(dt);

      // Loop through the schedule list and load the labels
      for (var i=0; i<pData.scheduleList.length; i++) {
        const sInfo = pData.scheduleList[i];
        // Set the labels for this schedule
        sInfo.churchLabels = pData.churchLabels.clone();

        // Load the scheduled labels for this service
        await pData.loadScheduledLabels(sInfo.serviceInfo.service_id, sInfo.churchLabels);
      }

      // Load the members scheduled for the labels
      await pData.loadScheduledMembersForMonth(dt);

      setScheduleList(pData.scheduleList);
      setScheduledDays(pData.monthlyDays);
  }

  const onAddMemberToSchedule = async (info:any, sTime:Date) => {
    const pData = pageData;

    // Add to the service
    await pData.addMemberToService(info);

    // Clear the cache
    const handler = new APIHandler();
    handler.clearCache(API_CALLS.schedule);
    handler.clearCache(API_CALLS.labelScheduled);

    await onDateChange(sTime);

    setPageData(pData);

  }

  const onRemoveMemberFromSchedule = async (info:any, sTime:Date) => {
    const pData = pageData;

    // Remove from the service
    await pData.removeMemberFromService(info);

    // Clear the cache
    const handler = new APIHandler();
    handler.clearCache(API_CALLS.schedule);
    handler.clearCache(API_CALLS.labelScheduled);

    await onDateChange(sTime);

    setPageData(pData);
  }

  const getServiceInfo = async() => {
    // Load member info
    const pData = pageData;
    await pData.loadMemberInfo();
    setUserInfo(pData.uInfo);

    // Load all the labels
    await pData.loadChurchLabels();

    // Load the members for the scheduled labels
    await pData.loadMembersForScheduledLabels();

    // Load the services for the month
    await loadServicesForMonth(pData, currentTime);

    // Show schedules for current time
    await onDateChange(currentTime);
    
    setPageData(pData);
  }

  // TODO JLS
  // The way this is loading data isn't correct. Fix it.

  useEffect(() => {
    getServiceInfo();
  }, []);

  return (
    <Grid2 container spacing={2}>
      <SChurchCalendar defaultDate={curentDate} onDateChanged={onDateChange} onMonthChanged={onMonthChange} scheduledDays={scheduledDays} />
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <SServiceAdd defaultDate={currentTime} onCreateService={onServiceCreated} church_id={userInfo.church_id} />
      </Grid2>
      {currentSchedule.map((item, index) => (
        <Grid2 size={12} key={item.serviceInfo.service_id + '_grid'}>
          <SServiceInfo key={item.serviceInfo.service_id} churchLabels={item.churchLabels} schedule={item} serviceInfo={item.serviceInfo} onAddMemberToSchedule={onAddMemberToSchedule} onRemoveMemberFromSchedule={onRemoveMemberFromSchedule} members={pageData.memberMap} />
        </Grid2>
      ))}
    </Grid2>  
  );
}


