interface SCalendarProps {
    selectedDate?: string;
    defaultDate?: string;
    restrictedDays?: number[];
    scheduledDays?: number[];
    onDateChanged?: (date:Date) => void;
    onMonthChanged?: (date:Date) => void;


    // TODO JLS, I think I can get ride of these
    churchId?: string;
    memberId?: string;
    onDateClicked?: (date:Date) => void;
    updateNumber?: number;
}