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
import { Grid2, Paper, Stack } from "@mui/material";
import {getDayString} from "./lib/DateUtils";

import { AppPageData } from "./db/AppPageData";
import { ServiceInfo } from "./lib/ServiceInfo";


Amplify.configure(outputs);

export default function App() {
  let [pageData, setPageData] = useState<AppPageData>(new AppPageData());
  let [defaultDate, setDefaultDate] = useState<string>(getDefaultSunday());
  let [selectedDay, setSelectedDay] = useState<string>(getDefaultSunday());
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
  let [scheduledDays, setScheduledDays] = useState<number[]>([]);
  let [serviceList, setServiceList] = useState<ServiceInfo[]>([]);

  const onDateChange = (date:Date) => {
    const dateStr = getDayString(date);
    setSelectedDay(dateStr);
  }

  const onGetSchedule = async(date:Date) => {
    const pData = pageData;
    const didLoad = await pData.loadScheduledDays(date);
    if (didLoad) {
      setPageData(pData);
      setScheduledDays(pData.scheduled);
    }
  }

  const onGetServices = async(yr:number, month:number, day:number) => {
    const pData = pageData;
    await pData.loadServiceForDay(yr, month, day);

    // Loop through the list of services.  For each service, we need to load the scheduled labels
    for(var i=0; i<pData.serviceList.length; i++) {
      const lbls = pData.serviceList[i].churchLabels;
      await pData.loadChurchLabels(lbls);
      await pData.loadScheduledLabels(pData.serviceList[i].service_id, lbls);
      await pData.loadMembersForScheduledLabels();
    }

    setPageData(pData);
    setServiceList(pData.serviceList);
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
      
      setUserInfo(pData.uInfo);
      setPageData(pData);
    }    

    getUserInfo();
  }, []);
  
  return (
    <main>
      <SNavbar userInfo={userInfo} onSignout={onSignout} />
      <br />
      <Grid2 container spacing={2}>
        <SChurchCalendar selectedDate={selectedDay} defaultDate={defaultDate} onDateChanged={onDateChange} scheduledDays={scheduledDays} onMonthChanged={onGetSchedule}  />
        <SAllServices serviceDate={selectedDay} serviceList={serviceList} loadServiceList={onGetServices} />
      </Grid2>
    </main>
  )
}
