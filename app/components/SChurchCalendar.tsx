import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import { useState, useEffect } from 'react';
import SCalendarDayComponent from './SCalendarDayComponent';
import { getDefaultSunday } from '../lib/dateUtils';

export default function SChurchCalendar(props: SCalendarProps) {
  let [defaultDay, setDefaultDay] = useState<string>(props.defaultDate || getDefaultSunday());
  let [scheduledDays, setScheduledDays] = useState<number[]>([]);
  
  // Set the selected day from a moment
  const setCalValue = (value:Moment) => {
    // Inform parent that selected day changed
    if (props.onDateChanged) {
      props.onDateChanged(value.toDate());
    }
  }

  const getServiceInfoFromApi = async(dt:Date) => {   
    if (props == undefined) return [];
    if (props.churchId == undefined) return [];
    if (props.churchId.length === 0) return [];

    var result = [];
    const res = await fetch(`/api/services?church_id=${props.churchId}&year=${dt.getFullYear()}&month=${dt.getMonth()+1}`, { cache: 'force-cache' });    
    result = await res.json();

    return result;
  }

  const getServiceInfo = async(dt:any) => {
    // If no props, then return
    if (props == undefined) return;

    // If no churchId, then return
    if (props.churchId == undefined) return;

    // If churchId is empty, then return
    if (props.churchId.length === 0) return;

    const data = await getServiceInfoFromApi(dt);

    const scheduled = [];
    for(var i=0; i<data.length; i++) {
      const epoc = data[i].serviceTime;
      const sDate = new Date(epoc);
      scheduled.push(sDate.getDate());
    }
    setScheduledDays(scheduled);
  }

  const onMonthYearChanged = (dChange:Moment) => {
    const dt = new Date(dChange.toDate());
    getServiceInfo(dt);
  }

  useEffect(() => {    
    getServiceInfo(moment(defaultDay).toDate());
  }, [props.churchId]);  

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateCalendar
      defaultValue={moment(defaultDay)}
      onChange={setCalValue}
      slots={{ day: SCalendarDayComponent }}
      slotProps={{ day: { scheduledDays } as any }}
      onMonthChange={onMonthYearChanged}
      onYearChange={onMonthYearChanged}
       />
    </LocalizationProvider>
  );
}