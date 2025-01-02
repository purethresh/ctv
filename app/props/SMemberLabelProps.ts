import { MinMemberInfo } from "../lib/MinMemberInfo";

export interface SMemberLabelProps {
    memberInfo?: MinMemberInfo;
    updateNumber?:number;
    showAdd?:boolean;
    showRemove?:boolean;
    addMember?: (memberInfo:MinMemberInfo) => void;
    removeMember?: (memberInfo:MinMemberInfo) => void;
}