import { FullMemberInfo } from "./FullMemberInfo";
import { ScheduleInfo } from "./ScheduleInfo";
import { getMinTimeForDay, getMaxTimeForDay } from "@/app/lib/DateUtils";
import { AvailabilityInfo } from "./AvailabilityInfo";
import { ServiceInfo } from "./ServiceInfo";
import ChurchLabels from "./ChurchLabels";


export class ChurchSchedule {
    church_id:string;
    serviceInfo:ServiceInfo;
    scheduleList: ScheduleInfo[];
    blockedOutList:AvailabilityInfo[];
    churchLabels:ChurchLabels;

    constructor(church_id:string) {
        this.church_id = church_id;
        this.scheduleList = [];
        this.blockedOutList = [];
        this.serviceInfo = new ServiceInfo({});
        this.churchLabels = new ChurchLabels();
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
}