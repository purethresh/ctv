import { AvailabilityInfo } from "./AvailabilityInfo";
import { IMinMemberInfo, MinMemberInfo } from "./MinMemberInfo";
import { ScheduleInfo } from "./ScheduleInfo";

export class FullMemberInfo extends MinMemberInfo {

    // Map of ScheduleInfo mapped by service_id
    scheduleMap:Map<string, Set<string>>;

    // Map of AvailabilityInfo mapped by blockedAsDateStr
    availabilityMap:Map<string, AvailabilityInfo>;

    constructor(obj:IMinMemberInfo = {}) {
        super(obj);

        // Key is the service_id - Then a set of label_id
        this.scheduleMap = new Map<string, Set<string>>();
        this.availabilityMap = new Map<string, AvailabilityInfo>();
    }

    // Clear Scheduled
    clearScheduled() {
        this.scheduleMap.clear();
    }

    addSchedule(sInfo:ScheduleInfo) {
        var s = new Set<string>();

        if (this.scheduleMap.has(sInfo.service_id)) {
            s = this.scheduleMap.get(sInfo.service_id) || new Set<string>();
        }
        s.add(sInfo.label_id);
        this.scheduleMap.set(sInfo.service_id, s);
    }

    addBlockedOutDay(aInfo:AvailabilityInfo) {
        const key = aInfo.blockedAsDateStr;
        this.availabilityMap.set(key, aInfo);
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
            return sInfo.has(labelId);
        }
        return false;
    }

    isRecommendedForLabel(serviceId:string, maxNumScheduled:number) : boolean {
        // Start by assuming this person is recommended        
        var recommended = true;

        // If already scheduled, then not recommended
        if (this.isScheduledForService(serviceId)) {
            recommended = false;
        }

        // If scheduled less than maxNumbScheduled, then recommended
        if (this.scheduleMap.size > maxNumScheduled) {
            recommended = false;
        }

        return recommended;
    }

    getScheduledNumber() : number {
        return this.scheduleMap.size;
    }

    static sortByName(a:FullMemberInfo, b:FullMemberInfo) : number {
        var result = a.first.localeCompare(b.first);
        if (result === 0) {
            result = a.last.localeCompare(b.last);
        }
        return result;
    }

}