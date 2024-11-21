import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import { useState, useEffect } from 'react';
import SCalendarDayComponent from './SCalendarDayComponent';
import { getDefaultSundayObject } from '../lib/dateUtils';
import UserInfo from '../lib/UserInfo';

export default function SChurchCalendar() {
  let [churchId, setChurchId] = useState<string>('');
  let [selectedDay, setSelectedDay] = useState<string>(getDefaultSundayObject());
  let [scheduledDays, setScheduledDays] = useState<number[]>([]);
  
  // Set the selected day from a moment
  const setCalValue = (value:any) => {
    const strDate = value.format('YYYY-MM-DD');
    setSelectedDay(strDate);
  }

  const getUserInfo = async() => {
      if (churchId.length === 0) {
        const uInfo = new UserInfo();
        await uInfo.loadMemberInfo();
        setChurchId(uInfo.church_id);
      }
  }

  const getServiceInfoFromApi = async(dt:Date) => {   
    var result = [];
    const res = await fetch(`/api/services?church_id=${churchId}&year=${dt.getFullYear()}&month=${dt.getMonth()+1}`, { cache: 'force-cache' });
    result = await res.json();

    return result;
  }

  const getServiceInfo = async(dt:any) => {
    if (churchId.length > 0) {
      const data = await getServiceInfoFromApi(dt);

      const scheduled = [];
      for(var i=0; i<data.length; i++) {
        const epoc = data[i].serviceTime;
        const sDate = new Date(epoc);
        scheduled.push(sDate.getDate());
      }

      setScheduledDays(scheduled);
    }
  }

  const onMonthYearChanged = (dChange:Moment) => {
    const dt = new Date(dChange.toDate());
    getServiceInfo(dt);
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {    
    getServiceInfo(new Date(selectedDay));
  }, [churchId]);  

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateCalendar
      defaultValue={moment(selectedDay)}
      onChange={setCalValue}
      slots={{ day: SCalendarDayComponent }}
      slotProps={{ day: { scheduledDays } as any }}
      onMonthChange={onMonthYearChanged}
      onYearChange={onMonthYearChanged}
       />
    </LocalizationProvider>
  );
}