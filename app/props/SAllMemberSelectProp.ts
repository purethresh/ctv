import { FullMemberInfo } from "../lib/FullMemberInfo";

export interface SAllMemberSelectProp {
    onClick?: (memberId:string) => void;
    isVisible?: boolean;
    defaultMemberId?: string;
    memberList: FullMemberInfo[];
}