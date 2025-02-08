import { MinMemberInfo } from "./MinMemberInfo";
import { ScheduleInfo } from "./ScheduleInfo";
import { getMinTimeForDay, getMaxTimeForDay } from "@/app/lib/DateUtils";
import { AvailabilityInfo } from "./AvailabilityInfo";


export class ChurchSchedule {
    church_id:string;
    scheduleList: ScheduleInfo[];
    blockedOutList:AvailabilityInfo[];

    constructor(church_id:string) {
        this.church_id = church_id;
        this.scheduleList = [];
        this.blockedOutList = [];
    }

    setScheduleList(list:ScheduleInfo[]) {
        this.scheduleList = list;
    }

    setBlockedOutList(list:AvailabilityInfo[]) {
        this.blockedOutList = list;
    }

    getMonthlySchedule = () : number[] => {
        var result:number[] = [];

        // Loop through the schedule list and get the days
        for(var i=0; i<this.scheduleList.length; i++) {
            const sInfo = this.scheduleList[i];
            const day = new Date(sInfo.serviceTime).getDate();
            if (!result.includes(day)) {
                result.push(day);
            }
        }

        return result;
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
                    m.setBockedOut();
                }
            }
        }
    }

}