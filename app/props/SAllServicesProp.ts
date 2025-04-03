// import { ServiceInfo } from "../lib/ServiceInfo";
import { ChurchSchedule } from "../lib/ChurchSchedule";
import { FullMemberInfo } from "../lib/FullMemberInfo";


export interface SAllServicesProp {
    scheduleList: ChurchSchedule[];
    members: Map<string, FullMemberInfo>;
    isAdmin: boolean;
}