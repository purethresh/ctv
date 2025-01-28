import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import { useState, useEffect } from 'react';
import SCalendarDayComponent from './SCalendarDayComponent';
import { getDefaultSunday } from '../lib/DateUtils';
import { Grid2, Paper } from '@mui/material';

export default function SChurchCalendar(props: SCalendarProps) {  
  let [selectedDate, setSelectedDate] = useState<string>(props.selectedDate || props.defaultDate || getDefaultSunday());
  let [defaultDay, setDefaultDay] = useState<string>(props.defaultDate || getDefaultSunday());
  let [scheduledDays, setScheduledDays] = useState<number[]>([]);
  let [lastCheckedDate, setLastCheckedDate] = useState<Date>(new Date('01/01/2000'));
  
  // Set the selected day from a moment
  const setCalValue = (value:Moment) => {
    // Inform parent that selected day changed
    if (props.onDateChanged) {
      props.onDateChanged(value.toDate());
    }
  }

  const onMonthYearChanged = (dChange:Moment) => {
    const dt = new Date(dChange.toDate());
    if (lastCheckedDate.getDate() == dt.getDate()) return;
    setLastCheckedDate(dt);

    // Notify that month year changed
    if (props.onMonthChanged) {
      props.onMonthChanged(dt);
    }
  }

  useEffect(() => {
    const strDt = props.selectedDate || props.defaultDate || getDefaultSunday();
    setSelectedDate(strDt);
    setScheduledDays(props.scheduledDays || []);
    onMonthYearChanged(moment(strDt));
  }, [props.defaultDate, props.updateNumber, props.selectedDate, props.scheduledDays]);  

  return (
    <Grid2 size={{ xs: 12, sm: 6 }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Paper>
          <DateCalendar
            defaultValue={moment(defaultDay)}
            onChange={setCalValue}
            slots={{ day: SCalendarDayComponent }}
            slotProps={{ day: { scheduledDays } as any }}
            onMonthChange={onMonthYearChanged}
            onYearChange={onMonthYearChanged}
        />
        </Paper>
      </LocalizationProvider>
    </Grid2>
  );
}