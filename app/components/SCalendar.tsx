import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { useState } from 'react';
import SCalendarDayComponent from './SCalendarDayComponent';
import { getDefaultSunday } from '../lib/dateUtils';

export default function SCalendar() {
  let [selectedDay, setSelectedDay] = useState<string>(getDefaultSunday());
  let [restrictedDays, setRestrictedDays] = useState<number[]>([]);
  let [scheduledDays, setScheduledDays] = useState<number[]>([]);

  // Set the selected day from a moment
  const setCalValue = (value:any) => {
    const strDate = value.format('YYYY-MM-DD');
    setSelectedDay(strDate);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateCalendar value={moment(selectedDay)} onChange={setCalValue}
      slots={{ day: SCalendarDayComponent }}
      slotProps={{ day: { restrictedDays, scheduledDays } as any }}
       />
    </LocalizationProvider>
  );
}