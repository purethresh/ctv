import { MinMemberInfo } from "./MinMemberInfo";
import { ScheduleInfo } from "./ScheduleInfo";
import { getStartOfPreviousMonth, getEndOfNextMonth, getMinTimeForDay, getMaxTimeForDay } from "@/app/lib/dateUtils";
import { AvailabilityInfo } from "./AvailabilityInfo";
import { ScheduleStatus } from "./ScheduleStatus";


export class ChurchSchedule {
    church_id:string;
    useCache:boolean = true;
    scheduleList: ScheduleInfo[];
    blockedOutList:AvailabilityInfo[];

    constructor(church_id:string) {
        this.church_id = church_id;
        this.scheduleList = [];
        this.blockedOutList = [];
    }

    // This gets all the schedules for the month of the date, plus the month before and the month after
    fetchScheduleWithBufferMonths = async(dt:Date) => {
        // get month / year as a string
        const month = (dt.getMonth() + 1).toString();
        const year = dt.getFullYear().toString();

        const res = await this.doGet(`/api/schedule?church_id=${this.church_id}&year=${year}&month=${month}`);
        const data = await res.json();

        if (data != null && data.length > 0) {
            for(var i=0; i<data.length; i++) {
                this.scheduleList.push(new ScheduleInfo(data[i]));
            }
        }
    }

    fetchBlockedOutDaysWithBufferMonths = async(dt:Date) => {
        // Get month / year as a string
        const min = getStartOfPreviousMonth(dt);
        const max = getEndOfNextMonth(dt);

        const res = await this.doGet(`/api/available?church_id=${this.church_id}&min=${min.getTime().toString()}&max=${max.getTime().toString()}`);
        const data = await res.json();

        this.blockedOutList = [];
        if (data != null && data.length > 0) {
            for(var i=0; i<data.length; i++) {            
                this.blockedOutList.push(new AvailabilityInfo(data[i]));
            }
        }
    }

    updateMembersWithSchedule = (memberMap:Map<string, MinMemberInfo>, service_id:string) => {
        // Loop through the members and reset
        memberMap.forEach((value:MinMemberInfo, key:string) => {
            value.resetScheduled();
        });

        // Loop through the schedule list and update the member schedule info
        for (var i=0; i<this.scheduleList.length; i++) {
            const sInfo = this.scheduleList[i];

            // If there is a member, update the number
            if (memberMap.has(sInfo.member_id)) {
                const mInfo = memberMap.get(sInfo.member_id) as MinMemberInfo;
                mInfo.incrementNumberScheduled();
            }

            // Now check if this is a matching service
            if (sInfo.service_id == service_id) {
                if (memberMap.has(sInfo.member_id)) {
                    const mInfo = memberMap.get(sInfo.member_id) as MinMemberInfo;
                    mInfo.addScheduledLabel(sInfo.label_id);
                }
            }
        }
    }

    updateMemberWithBlockOutDays = (memberMap:Map<string, MinMemberInfo>, serviceTime:Date) => {
        // Get the Min / Max for the service Time
        const min = getMinTimeForDay(serviceTime);
        const max = getMaxTimeForDay(serviceTime);

        // Now loop through the blocked out days and update status
        for (var i=0; i<this.blockedOutList.length; i++) {
            const bInfo = this.blockedOutList[i];
            if (bInfo.blockedAsNumber >= min && bInfo.blockedAsNumber <= max) {
                // This date is blocked out. Get the member and mark there status as blocked out
                if (memberMap.has(bInfo.member_id)) {
                    const m = memberMap.get(bInfo.member_id) as MinMemberInfo;
                    m.scheduledStatus = ScheduleStatus.blockedOut;
                }
            }
        }

    }

    private async doGet(url:string) : Promise<Response> {
        if (this.useCache) {
            return fetch(url, { cache: 'force-cache' });
        }
        else {
            return fetch(url);
        }
    }
}