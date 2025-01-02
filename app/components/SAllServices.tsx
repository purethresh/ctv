"use client"

import { useEffect, useState } from "react";
import SServiceSchedule from "./SServiceSchedule";
import { ServiceInfo } from "../lib/ServiceInfo";
import { API_CALLS, APIHandler } from "../lib/APIHanlder";
import { Grid2, Box } from "@mui/material";

export default function SAllServices(props:SAllServicesProp) {
  let [serviceIdList, setServiceIdList] = useState<ServiceInfo[]>([]);

  // Get the services for the selected day
  const getServicesForDay = async() => {
    if (props == undefined) return;
    if (props.serviceDate == undefined) return;
    if (props.churchId == undefined) return;
    
    const serviceDate = new Date(props.serviceDate);
    const yr = serviceDate.getFullYear();
    const mo = serviceDate.getMonth() + 1;
    const dy = serviceDate.getDate() + 1;

    const api = new APIHandler();
    const result = await api.getData(API_CALLS.services, { church_id: props.churchId, year: yr, month: mo, day: dy }, true);
    var rs = await result.json();

    const serviceList:ServiceInfo[] = [];
    for(var i=0; i<rs.length; i++) {
      const sInfo = new ServiceInfo(rs[i]);
      serviceList.push(sInfo);
    }

    setServiceIdList(serviceList);
  }

  useEffect(() => {
    getServicesForDay();
  }, [props.serviceDate, props.churchId]);

  return (
    <>
      {serviceIdList.map((item, index) => (
        <Grid2 size={{ xs: 12, sm: 6}}>
          <SServiceSchedule key={index+'_schedule'} serviceInfo={item} />
        </Grid2>        
      ))}
    </>
  );
}