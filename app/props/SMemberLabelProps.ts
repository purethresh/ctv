import { FullMemberInfo } from "../lib/FullMemberInfo";

export interface SMemberLabelProps {
    memberInfo?: FullMemberInfo;
    label_id?:string;
    service_id?:string;
    serviceDate?:string;
    showAdd?:boolean;
    showRemove?:boolean;
    addMember?: (memberInfo:FullMemberInfo) => void;
    removeMember?: (memberInfo:FullMemberInfo) => void;
}