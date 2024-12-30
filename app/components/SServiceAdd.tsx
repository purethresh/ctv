"use client"
import { Button, TextField, IconButton, Box } from "@mui/material";
import { useState, useEffect } from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import { SServiceAddProps } from "../props/SServiceAddProps";
import moment from 'moment';
import { Moment } from "moment";
import { IServiceInfo, ServiceInfo } from "../lib/ServiceInfo";
import { v4 } from "uuid";
import { API_CALLS, APIHandler } from "../lib/APIHanlder";

export default function SServiceAdd(props:SServiceAddProps) {
  let [isCreating, setIsCreating] = useState<Boolean>(false);
  let [defaultDate, setDefaultDate] = useState<Date>(props.defaultDate || new Date());
  let [serviceTime, setServiceTime] = useState<Date>(new Date());
  let [serviceName, setServiceName] = useState<string>('');
  let [serviceInfo, setServiceInfo] = useState<string>('');
  
  const startCreating = () => {
    setIsCreating(true);
  }

  const timeChange = (mom:Moment | null) => {
    if (!mom) {
      return;
    }
    setServiceTime(mom.toDate());
  }

  const updateDefaultTime = () => {
    setServiceName('');
    setServiceInfo('');
    setDefaultDate(props.defaultDate || new Date());
  }

  const serviceNameChange = (event:any) => {
    setServiceName(event.target.value);
  }

  const serviceInfoChange = (event:any) => {
    setServiceInfo(event.target.value);
  }

  const createService = async () => {
    setIsCreating(false);

    // If no church id, then we can't create a service
    if (props.church_id === undefined || props.church_id.length <= 0) {
      return;
    }

    // Create the propert time
    const sTime = new Date(defaultDate.getTime());
    sTime.setHours(serviceTime.getHours());
    sTime.setMinutes(serviceTime.getMinutes());
    sTime.setSeconds(0);
    sTime.setMilliseconds(0);

    // Create Service info
    const sObj: IServiceInfo = { service_id:v4(), church_id:props.church_id, serviceTime:sTime.getTime(), name:serviceName, info:serviceInfo };
    var sInfo = new ServiceInfo( sObj );

    // Call the API
    const api = new APIHandler();
    await api.createData(API_CALLS.services, sInfo);

    if (props.onCreateService) {
      props.onCreateService();
    }
  }

  useEffect(() => {
    updateDefaultTime();
  }, [props.defaultDate]);

  return (
    <>
      <Box style={{display:isCreating ? 'none' : 'block'}}>
        <Button onClick={startCreating}>Add Service</Button>
      </Box>
      <Box style={{display:isCreating ? 'block' : 'none'}}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <TimePicker label="Service Time" defaultValue={moment(defaultDate)} onChange={timeChange} />
        </LocalizationProvider>        
        <TextField id="service-name" label="Service Name" onChange={serviceNameChange} value={serviceName} />
        <TextField id="service-info" label="Service Info" onChange={serviceInfoChange} value={serviceInfo} />
        <Button onClick={createService}>Create</Button>
      </Box>
    </>
  );
}