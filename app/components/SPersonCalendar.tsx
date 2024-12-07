"use client";

import * as React from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useState, useEffect } from 'react';
import { getDefaultSunday } from '../lib/dateUtils';
import moment, { Moment } from 'moment';

export default function SPersonCalendar(props: SCalendarProps) {
    let [defaultDay, setDefaultDay] = useState<string>(props.defaultDate || getDefaultSunday());

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateCalendar
                    defaultValue={moment(defaultDay)}
                    />
            </LocalizationProvider>
        </>
    );
}