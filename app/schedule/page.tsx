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
import { FullMemberInfo } from '../lib/FullMemberInfo';

export default function SchedulePage() {
  let [pageData, setPageData] = useState<SchedulePageData>(new SchedulePageData());
  let [scheduleList, setScheduleList] = useState<ChurchSchedule[]>([]);
  let [scheduledDays, setScheduledDays] = useState<number[]>([]);
  
  let [curentDate, setCurrentDate] = useState<string>(getDefaultSunday());
  let [currentTime, setCurrentTime] = useState<Date>(new Date(getDefaultSunday()));
  let [currentSchedule, setCurrentSchedule] = useState<ChurchSchedule[]>([]);
  let [hasBeenInitialized, setHasBeenInitialized] = useState<boolean>(false);

  let [memberMap, setMemberMap] = useState<Map<string, FullMemberInfo>>(new Map<string, FullMemberInfo>());
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());

  const onDateChange = async (dt:Date, data:SchedulePageData | undefined = undefined) => {
    // The schedule should already be loaded, we just need to show it.
    const pData = data || pageData;
    pData.selectServiceForDay(dt);

    // Save the time change here
    setCurrentTime(dt);
    setCurrentDate(getDayString(dt));

    // Only save if no data was supplied
    if (data == undefined) {
      saveData(pData);
    }
  }

  const onMonthChange = async (dt:Date) => {
    if (!hasBeenInitialized) {
      return;
    }
    const pData = pageData;
    await pData.loadServiceForDay(dt.getFullYear(), dt.getMonth()+1, dt.getDate());

    await loadServicesForMonth(pageData, dt);
    saveData(pData);
  }

  const onServiceCreated = async (sInfo:ServiceInfo) => {
    const pData = pageData;
    await pData.createService(sInfo);

    await loadServicesForMonth(pData, currentTime);
    saveData(pData);
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
  }

  const onAddMemberToSchedule = async (info:any, sTime:Date) => {
    const pData = pageData;

    // Add to the service
    await pData.addMemberToService(info);

    // Reload members scheduled for the month
    await loadServicesForMonth(pData, sTime); // TODO JLS, does this work

    // Force a refresh of the data
    await onDateChange(sTime, pData);
    saveData(pData);
  }

  const onRemoveMemberFromSchedule = async (info:any, sTime:Date) => {
    const pData = pageData;

    // Remove from the service
    await pData.removeMemberFromService(info);

    // Reload members scheduled for the month
    await loadServicesForMonth(pData, sTime); // TODO JLS, does this work

    // Force a refresh of the data
    await onDateChange(sTime, pData);
    saveData(pData);
  }

  const saveData = (pData:SchedulePageData) => {
    setMemberMap(pData.memberMap);
    setScheduleList(pData.scheduleList);
    setScheduledDays(pData.monthlyDays);
    setPageData(pData);
    setCurrentSchedule(pData.currentSchedule);
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
    await onDateChange(currentTime, pData);

    // Set data
    saveData(pData);
  }

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
          <SServiceInfo key={item.serviceInfo.service_id} churchLabels={item.churchLabels} schedule={item} serviceInfo={item.serviceInfo} onAddMemberToSchedule={onAddMemberToSchedule} onRemoveMemberFromSchedule={onRemoveMemberFromSchedule} members={memberMap} />
        </Grid2>
      ))}
    </Grid2>  
  );
}


