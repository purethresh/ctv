import { MinMemberInfo } from "../lib/MinMemberInfo";

export interface SAllMemberSelectProp {
    onClick?: (memberId:string) => void;
    isVisible?: boolean;
    defaultMemberId?: string;
    memberList: MinMemberInfo[];
}