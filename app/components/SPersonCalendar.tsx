"use client";

import * as React from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useState, useEffect } from 'react';
import { getDefaultSunday } from '../lib/dateUtils';
import moment, { Moment } from 'moment';
import SCalendarDayComponent from './SCalendarDayComponent';

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
        const yStr = dChange.year().toString();
        const mStr = (dChange.month() + 1).toString().padStart(2, '0');

        if (props.onMonthChanged) {
            props.onMonthChanged(mStr, yStr);
        }
    }

    const onClickedDate = (dt:Moment) => {
        if (props.onDateClicked) {
            props.onDateClicked(dt.toDate());
        }
    }


    useEffect(() => {    
        setRestrictedDays(props.restrictedDays || []);
    }, [props.restrictedDays]);

    return (
        <>
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
        </>
    );
}