"use client"

import { useEffect, useState } from "react";
import SServiceSchedule from "./SServiceSchedule";
import { ServiceInfo } from "../lib/ServiceInfo";
import { API_CALLS, APIHandler } from "../lib/APIHanlder";

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

    const serviceList = [];
    for(var i=0; i<rs.length; i++) {
      serviceList.push(rs[i]);
    }

    setServiceIdList(serviceList);
  }

  useEffect(() => {
    getServicesForDay();
  }, [props.serviceDate, props.churchId]);

  return (
    <>
      {serviceIdList.map((item, index) => (
        <SServiceSchedule key={index} serviceId={item.service_id} churchId={item.church_id} serviceName={item.name} serviceInfo={item.info} />
      ))}
    </>
  );
}