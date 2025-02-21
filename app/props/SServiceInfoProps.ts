import ChurchLabels from "../lib/ChurchLabels";
import { ChurchSchedule } from "../lib/ChurchSchedule";
import { FullMemberInfo } from "../lib/FullMemberInfo";
import { ServiceInfo } from "../lib/ServiceInfo";

export interface SServiceInfoProps {
    serviceInfo: ServiceInfo;
    churchLabels: ChurchLabels;
    schedule: ChurchSchedule;
    members: Map<string, FullMemberInfo>;

    onAddMemberToSchedule?: (info:any, sTime:Date) => Promise<void>;
    onRemoveMemberFromSchedule?: (info:any, sTime:Date) => Promise<void>;
}