"use client";

import * as React from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useState, useEffect } from 'react';
import { getDefaultSunday } from '../lib/DateUtils';
import moment, { Moment } from 'moment';
import SCalendarDayComponent from './SCalendarDayComponent';
import { Grid2, Paper } from '@mui/material';

export default function SPersonCalendar(props: SCalendarProps) {
    let [defaultDay, setDefaultDay] = useState<string>(props.defaultDate || getDefaultSunday());
    let [restrictedDays, setRestrictedDays] = useState<number[]>(props.restrictedDays || []);

    const setCalValue = (value:Moment) => {
        // Inform parent that selected day changed
        if (props.onDateChanged) {
            props.onDateChanged(value.toDate());
        }
    }

    const onMonthYearChanged = (dChange:Moment) => {
        if (props.onMonthChanged) {
            props.onMonthChanged(dChange.toDate());
        }
    }

    useEffect(() => {    
        setRestrictedDays(props.restrictedDays || []);
    }, [props.restrictedDays]);

    return (
        <Grid2 size={{ xs: 12, sm: 6 }}>
            <Paper>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateCalendar
                        defaultValue={moment(defaultDay)}
                        slots={{ day: SCalendarDayComponent }}
                        slotProps={{ day: { restrictedDays } as any }}

                        onChange={setCalValue}
                        onMonthChange={onMonthYearChanged}
                        onYearChange={onMonthYearChanged}
                        />
                </LocalizationProvider>
            </Paper>
        </Grid2>
    );
}