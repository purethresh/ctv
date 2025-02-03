import { MinMemberInfo } from "../lib/MinMemberInfo";

export interface SMemberLabelProps {
    memberInfo?: MinMemberInfo;
    updateNumber?:number;
    label_id?:string;
    showAdd?:boolean;
    showRemove?:boolean;
    addMember?: (memberInfo:MinMemberInfo) => void;
    removeMember?: (memberInfo:MinMemberInfo) => void;
}