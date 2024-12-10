"use client"
import { Button, TextField, IconButton, Box } from "@mui/material";
import { useState, useEffect } from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import { SServiceAddProps } from "../props/SServiceAddProps";
import moment from 'moment';
import { Moment } from "moment";

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

  const serviceNameChange = (event:any) => {
    setServiceName(event.target.value);
  }

  const serviceInfoChange = (event:any) => {
    setServiceInfo(event.target.value);
  }

  const createService = () => {
    // TODO JLS
    // Need to create a service using the API

    setIsCreating(false);

    // If no church id, then we can't create a service
    if (props.church_id === undefined || props.church_id.length <= 0) {
      return;
    }
  }

  useEffect(() => {
    // TODO JLS
    // When the default date has changed, we need to reset this info
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
        <TextField id="service-name" label="Service Name" onChange={serviceNameChange} />
        <TextField id="service-info" label="Service Info" onChange={serviceInfoChange} />
        <Button onClick={createService}>Create</Button>
      </Box>
    </>
  );
}