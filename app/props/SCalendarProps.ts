interface SCalendarProps {
    selectedDate?: string;
    defaultDate?: string;
    restrictedDays?: number[];
    scheduledDays?: number[];
    onDateChanged?: (date:Date) => void;
    onMonthChanged?: (date:Date) => void;
}