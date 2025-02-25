"use client"

import { useEffect, useState } from "react";
import SServiceSchedule from "./SServiceSchedule";
import { Grid2 } from "@mui/material";
import { SAllServicesProp } from "../props/SAllServicesProp";
import { ChurchSchedule } from "../lib/ChurchSchedule";
import { FullMemberInfo } from "../lib/FullMemberInfo";

export default function SAllServices(props:SAllServicesProp) {
  let [scheduleList, setScheduleList] = useState<ChurchSchedule[]>(props.scheduleList);
  let [memberMap, setMemberMap] = useState<Map<string, FullMemberInfo>>(props.members);

  // Get the services for the selected day
  const getServicesForDay = async() => {
    setScheduleList(props.scheduleList);
    setMemberMap(props.members);
  }

  useEffect(() => {
    getServicesForDay();
  }, [props.scheduleList]);

  return (
    <>
      {scheduleList.map((item, index) => (
        <Grid2 key={item.serviceInfo.service_id+'_schedule_grid'} size={{ xs: 12, sm: 6}}>
          <SServiceSchedule key={index+'_schedule'} schedule={item} members={memberMap} />
        </Grid2>        
      ))}
    </>
  );
}