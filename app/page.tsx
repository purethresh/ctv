"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import SNavbar from "./components/SNavbar";
import SChurchCalendar from "./components/SChurchCalendar";
import { getDefaultSunday } from "./lib/DateUtils";
import { useState } from "react";
import { useEffect } from "react";
import SAllServices from "./components/SAllServices";
import UserInfo from "./lib/UserInfo";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Grid2 } from "@mui/material";

import { AppPageData } from "./db/AppPageData";
import { ChurchSchedule } from "./lib/ChurchSchedule";
import { FullMemberInfo } from "./lib/FullMemberInfo";


Amplify.configure(outputs);

export default function App() {
  let [pageData, setPageData] = useState<AppPageData>(new AppPageData());
  let [defaultDate, setDefaultDate] = useState<string>(getDefaultSunday());
  let [selectedDay, setSelectedDay] = useState<string>(getDefaultSunday());
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
  let [scheduledDays, setScheduledDays] = useState<number[]>([]);
  let [currentSchedule, setCurrentSchedule] = useState<ChurchSchedule[]>([]);
  let [hasBeenInitialized, setHasBeenInitialized] = useState<boolean>(false);
  let [memberMap, setMemberMap] = useState<Map<string, FullMemberInfo>>(new Map<string, FullMemberInfo>());
  let [isMemberAdmin, setIsMemberAdmin] = useState<boolean>(false);

  const onDateChange = (date:Date) => {
    const pData = pageData;
    pData.selectServiceForDay(date);
    setCurrentSchedule(pData.currentSchedule);
    setPageData(pData);    
  }

  const onGetSchedule = async(date:Date) => {
    if (!hasBeenInitialized) {
      return;
    }

    const pData = pageData;
    await loadServicesForMonth(pData, date);

    setScheduledDays(pData.monthlyDays);
    setCurrentSchedule(pData.currentSchedule);
    setPageData(pData);
  }

  const loadServicesForMonth = async (pData:AppPageData, dt:Date) => {
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

  const onSignout = () => {
    const pData = pageData;
    pageData.signOut();
    setPageData(pData);
    setUserInfo(pageData.uInfo);
  }

  useEffect(() => {
    const getUserInfo = async() => {
      const pData = pageData;
      await pData.loadMemberInfo()

      // Load all the labels
      await pData.loadChurchLabels();
      await pData.loadAdminInfo();
      
      // Load the members for the scheduled labels
      await pData.loadMembersForScheduledLabels();

      // Load the services for the month
      const dt = new Date(selectedDay);
      await loadServicesForMonth(pData, dt);
    
      const isAdmin = pData.churchLabels.labelRoot?.isOwner(pData.uInfo.member_id) || false;
      setIsMemberAdmin(isAdmin);

      setUserInfo(pData.uInfo);
      setMemberMap(pData.memberMap);
      setScheduledDays(pData.monthlyDays);
      setCurrentSchedule(pData.currentSchedule);
      setPageData(pData);
      setHasBeenInitialized(true);
    }    

    getUserInfo();
  }, []);
  
  return (
    <main>
      <SNavbar userInfo={userInfo} onSignout={onSignout} />
      <br />
      <Grid2 container spacing={2}>
        <SChurchCalendar selectedDate={selectedDay} defaultDate={defaultDate} onDateChanged={onDateChange} scheduledDays={scheduledDays} onMonthChanged={onGetSchedule}  />
        <SAllServices scheduleList={currentSchedule} members={memberMap} isAdmin={isMemberAdmin} />      
      </Grid2>
    </main>
  )
}
