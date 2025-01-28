"use client"

import { useEffect, useState } from "react";
import SServiceSchedule from "./SServiceSchedule";
import { ServiceInfo } from "../lib/ServiceInfo";
import { Grid2 } from "@mui/material";
import { SAllServicesProp } from "../props/SAllServicesProp";

export default function SAllServices(props:SAllServicesProp) {
  let [serviceDate, setServiceDate] = useState<string>(props.serviceDate || '');
  let [serviceIdList, setServiceIdList] = useState<ServiceInfo[]>(props.serviceList);


  // Get the services for the selected day
  const getServicesForDay = async() => {
    setServiceIdList(props.serviceList);

    if (props == undefined) return;
    if (props.serviceDate == undefined) return;
    if (props.serviceDate.length == 0) return;

    if ( props.serviceDate != serviceDate ) {
      const sDate = new Date(serviceDate);
      const yr = sDate.getFullYear();
      const mo = sDate.getMonth() + 1;
      const dy = sDate.getDate() + 1;
      setServiceDate(props.serviceDate);

      // Now load the service list
      props.loadServiceList(yr, mo, dy);
    }
  }

  useEffect(() => {
    getServicesForDay();
  }, [props.serviceDate, props.serviceList]);

  return (
    <>
      {serviceIdList.map((item, index) => (
        <Grid2 key={index+'_schedule_grid'} size={{ xs: 12, sm: 6}}>
          <SServiceSchedule key={index+'_schedule'} serviceInfo={item} />
        </Grid2>        
      ))}
    </>
  );
}