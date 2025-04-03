import { ChurchSchedule } from "../lib/ChurchSchedule";
import { FullMemberInfo } from "../lib/FullMemberInfo";
// import { ServiceInfo } from "../lib/ServiceInfo";

export interface SServiceScheduleProps {
    schedule:ChurchSchedule;
    members: Map<string, FullMemberInfo>;
    isAdmin: boolean;
}