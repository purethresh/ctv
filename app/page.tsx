"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import SNavbar from "./components/SNavbar";
import SChurchCalendar from "./components/SChurchCalendar";
import { getDefaultSunday } from "./lib/dateUtils";
import { useState } from "react";
import { useEffect } from "react";
import SServices from "./components/SServices";
import UserInfo from "./lib/UserInfo";

Amplify.configure(outputs);

// TODO JLS HERE
// Create a Lib for getting user Info
// 
// Then call that here at the page level
// Pass the results into SNavbar, SChurchCalendar, and SLabelDay
//
// *
// * Then pass them into the SCalendar component.
// * Get called when selected date is changed
// * Pass that into SLabelDay
// * Implement SLabelDay

export default function App() {
  let [selectedDay, setSelectedDay] = useState<string>(getDefaultSunday());
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());

  const onDateChange = (date:Date) => {
    setSelectedDay(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
  }

  const onSignout = () => {
    // Reset the user info
    setUserInfo(new UserInfo());
  }

  useEffect(() => {
    const getUserInfo = async() => {
      const uInfo = new UserInfo();

      await uInfo.loadMemberInfo();
      setUserInfo(uInfo);
    }    

    getUserInfo();
  }, []);  

  return (
    <main>
      <SNavbar userInfo={userInfo} onSignout={onSignout} />
      <SChurchCalendar defaultDate={selectedDay} onDateChanged={onDateChange} churchId={userInfo.church_id} />
      <SServices serviceDate={selectedDay} churchId={userInfo.church_id} />
    </main>
  )
}
