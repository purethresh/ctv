import { LabelInfo } from '../lib/LabelInfo';
import { MinMemberInfo } from '../lib/MinMemberInfo';

export interface SLabelInfoProps {
    labelInfo?:LabelInfo;
    memberList?:MinMemberInfo[];
    ownerList?:MinMemberInfo[];
    userId?:string;
    churchId?:string;
    onReload?:() => void;
    onAddMember?: (memberId:string, labelId:string, owner:boolean) => void;
    onRemoveMember?: (memberId:string, labelId:string) => void;
}