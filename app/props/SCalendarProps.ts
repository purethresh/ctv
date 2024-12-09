interface SCalendarProps {
    defaultDate?: string;
    restrictedDays?: number[];
    churchId?: string;
    memberId?: string;
    onDateChanged?: (date:Date) => void;
    onMonthChanged?: (month:string, year:string) => void;
    onDateClicked?: (date:Date) => void;
}