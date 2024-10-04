"use client";

import { useState, useEffect } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

Amplify.configure(outputs);

interface userInfo {
  isAuthenticated:boolean,
  firstName:string,
  lastName:string,
  authId:string
}

export default function App() {
  const [userInfo, setUserInfo] = useState({isAuthenticated:false, firstName:'', lastName:'', authId:''});


  useEffect(() => {
    const getUInfo = async() => {
      try {
        // Looged in, get the info
        const aInfo = await fetchUserAttributes();
        setUserInfo({isAuthenticated:true, firstName:aInfo.given_name || '', lastName:aInfo.family_name || '', authId:aInfo.sub || ''});
      }
      catch(e) {
        // Not logged in
        const info = userInfo;
        info.isAuthenticated = false;
        setUserInfo(info);
      }
    }

    getUInfo();
  }, []);


  function getWelcomeString() : string {
    const info = userInfo;
    if (info.isAuthenticated) {
      return 'Hello ' + info.firstName + " " + info.lastName;
    }
    else {
      return "Not Logged In";
    }
  }

  // TODO JLS, pull this out into a component
  // If logged in show name and sign out
  // If not logged in, show sign in button
  // This should all be at the bar at the top
  // The nav should be based on this

  // For this page specifically show a calander and who is serving this week
  // Click on dates to see each
  // If logged in, then use red for days not avaialble and green for days that person is serving


  return (
        <main>
          <h1>{getWelcomeString()}</h1>
          <Calendar />
        </main>
  );
}
