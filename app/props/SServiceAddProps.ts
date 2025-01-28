import { ServiceInfo } from "../lib/ServiceInfo";

export interface SServiceAddProps {
    defaultDate?: Date;
    onCreateService?: (sInfo:ServiceInfo) => void;
    church_id?: string;
}