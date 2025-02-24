import { IMinMemberInfo, MinMemberInfo } from "./MinMemberInfo";
import { ScheduleInfo } from "./ScheduleInfo";

export class FullMemberInfo extends MinMemberInfo {

    // Map of ScheduleInfo mapped by service_id
    scheduleMap:Map<string, ScheduleInfo>;

    // Map of AvailabilityInfo mapped by blockedAsDateStr
    availabilityMap:Map<string, ScheduleInfo>;

    constructor(obj:IMinMemberInfo = {}) {
        super(obj);

        this.scheduleMap = new Map<string, ScheduleInfo>();
        this.availabilityMap = new Map<string, ScheduleInfo>();
    }

    // Clear Scheduled
    clearScheduled() {
        this.scheduleMap.clear();
    }

    addSchedule(sInfo:ScheduleInfo) {
        this.scheduleMap.set(sInfo.service_id, sInfo);
    }

    isBlockedOutForService(blockedAsDateStr:string) : boolean {
        return this.availabilityMap.has(blockedAsDateStr);
    }

    isScheduledForService(serviceId:string) : boolean {
        return this.scheduleMap.has(serviceId);
    }

    isScheduledForLabel(serviceId:string, labelId:string) : boolean {
        const sInfo = this.scheduleMap.get(serviceId);
        if (sInfo) {
            return sInfo.label_id === labelId;
        }
        return false;
    }

    isRecommendedForLabel(labelId:string) : boolean {
        // TODO JLS - need to implement
        return false;
    }

}