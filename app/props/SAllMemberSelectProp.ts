import { MinMemberInfo } from "../lib/MinMemberInfo";

export interface SAllMemberSelectProp {
    updateNumber?: number;
    onClick?: (memberId:string) => void;
    isVisible?: boolean;
    defaultMemberId?: string;
    memberList: MinMemberInfo[];
}