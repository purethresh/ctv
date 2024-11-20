import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import moment, { Moment } from 'moment';
import Badge from '@mui/material/Badge';

const RESTRICTED_COLOR = '#FCE3E3';

// Custom day Render
export default function SCalendarDayComponent(props: PickersDayProps<Moment> & { restrictedDays?: number[], scheduledDays?: number[] }) {
    const { restrictedDays = [], scheduledDays = [], day, outsideCurrentMonth, ...other } = props;

    const isRestricted = !props.outsideCurrentMonth && restrictedDays.indexOf(props.day.date()) >= 0;
    const isScheduled = !props.outsideCurrentMonth && scheduledDays.indexOf(props.day.date()) >= 0;

    return (
        <Badge
            overlap="circular"
            color="secondary"
            badgeContent={isScheduled ? '' : undefined}
        >
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} sx={{ backgroundColor: isRestricted ? RESTRICTED_COLOR : undefined}} />
        </Badge>
    );
}