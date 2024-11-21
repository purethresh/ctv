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
import SAllServices from "./components/SAllServices";
import UserInfo from "./lib/UserInfo";

Amplify.configure(outputs);

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
      <SAllServices serviceDate={selectedDay} churchId={userInfo.church_id} />
    </main>
  )
}
