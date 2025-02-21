import { FullMemberInfo } from "../lib/FullMemberInfo";

export interface SMemberLabelProps {
    memberInfo?: FullMemberInfo;
    updateNumber?:number;
    label_id?:string;
    showAdd?:boolean;
    showRemove?:boolean;
    addMember?: (memberInfo:FullMemberInfo) => void;
    removeMember?: (memberInfo:FullMemberInfo) => void;
}