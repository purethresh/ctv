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

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";


Amplify.configure(outputs);

export default function App() {
  let [defaultDate, setDefaultDate] = useState<string>(getDefaultSunday());
  let [selectedDay, setSelectedDay] = useState<string>(getDefaultSunday());
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());

  const onDateChange = (date:Date) => {
    const dateStr = getDayString(date);
    setSelectedDay(dateStr);
  }

  const onSignout = () => {
    // Reset the user info
    setUserInfo(new UserInfo());
  }

  useEffect(() => {
    const getUserInfo = async() => {

      // TODO JLS, testing here
      const client = generateClient<Schema>() // use this Data client for CRUDL requests
      const tmp = await client.models.members.list();
      console.log(tmp); // TODO JLS

      // const { data: todos } = await client.models.Todo.list()


      const uInfo = new UserInfo();
      await uInfo.loadMemberInfo();
      setUserInfo(uInfo);
    }    

    getUserInfo();
  }, []);
  
  return (
    <main>
      TODO JLS HERE
    </main>
  )


  // <SNavbar userInfo={userInfo} onSignout={onSignout} />
      // <br />
      // <Grid2 container spacing={2}>
      //   <SChurchCalendar selectedDate={selectedDay} defaultDate={defaultDate} onDateChanged={onDateChange} churchId={userInfo.church_id} />
      //   <SAllServices serviceDate={selectedDay} churchId={userInfo.church_id} />
      // </Grid2>        

}
