import { LabelInfo } from '../lib/LabelInfo';
import { MinMemberInfo } from '../lib/MinMemberInfo';

export interface SLabelInfoProps {
    labelInfo?:LabelInfo;
    memberList?:MinMemberInfo[];
    ownerList?:MinMemberInfo[];
    userId?:string;
    churchId?:string;
    allMembers:MinMemberInfo[];

    onAddMember?: (memberId:string, labelId:string, owner:boolean) => void;
    onRemoveMember?: (memberId:string, labelId:string) => void;
    onDeleteLabel?: (labelId:string) => void;
    onUpdateLabel?: (label:LabelInfo) => void;
}