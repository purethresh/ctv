import { MinMemberInfo } from "../lib/MinMemberInfo";

export interface SMemberLabelProps {
    memberInfo?: MinMemberInfo;
    showStatus?:boolean;
    showAdd?:boolean;
    showRemove?:boolean;
    updateNumber?:number;
    addMember?: (member_id:string) => void;
    removeMember?: (member_id:string) => void;
}