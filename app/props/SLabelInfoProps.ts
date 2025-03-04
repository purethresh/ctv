import { LabelInfo } from '../lib/LabelInfo';
import { FullMemberInfo } from '../lib/FullMemberInfo';

export interface SLabelInfoProps {
    labelInfo?:LabelInfo;
    memberList?:FullMemberInfo[];
    ownerList?:FullMemberInfo[];
    userId?:string;
    churchId?:string;
    allMembers:FullMemberInfo[];

    onAddMember?: (memberId:string, labelId:string, owner:boolean) => void;
    onRemoveMember?: (memberId:string, labelId:string) => void;
    onDeleteLabel?: (labelId:string) => void;
    onUpdateLabel?: (label:LabelInfo) => void;
}