import { MinMemberInfo } from "../lib/MinMemberInfo";

export interface SMemberChipProps {
    memberInfo?:MinMemberInfo;
    onRemove?:(memberId:string) => void;    
}