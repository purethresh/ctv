import { AvailabilityInfo } from "../lib/AvailabilityInfo";

export interface SAvailabilityListProp {
    blockedList: AvailabilityInfo[];
    onRemove?: (aInfo:AvailabilityInfo) => void;
}