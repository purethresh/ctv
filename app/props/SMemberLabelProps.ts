import { MinMemberInfo } from "../lib/MinMemberInfo";

export interface SMemberLabelProps {
    memberInfo?: MinMemberInfo;
    showStatus?:boolean;
    updateNumber?:number;
    addMember?: (memberInfo:MinMemberInfo) => void;
    removeMember?: (memberInfo:MinMemberInfo) => void;
}