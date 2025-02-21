import { FullMemberInfo } from '../lib/FullMemberInfo';
import { LabelInfo } from '../lib/LabelInfo';
import { MinMemberInfo } from '../lib/MinMemberInfo';

export interface SLabelGroupProps {
    groupInfo?:LabelInfo;
    updateNumber?:number;
    showAddMember?:boolean;
    showRemoveMember?:boolean;
    members?:Map<string, FullMemberInfo>;
    serviceId?:string;
    onAddMember?:(memberInfo:FullMemberInfo, labelInfo:LabelInfo) => void;
    onRemoveMember?:(memberInfo:FullMemberInfo, labelInfo:LabelInfo) => void;
}