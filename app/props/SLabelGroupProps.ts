import { LabelInfo } from '../lib/LabelInfo';
import { MinMemberInfo } from '../lib/MinMemberInfo';

export interface SLabelGroupProps {
    groupInfo?:LabelInfo;
    updateNumber?:number;
    showAddMember?:boolean;
    showRemoveMember?:boolean;
    onAddMember?:(memberInfo:MinMemberInfo, labelInfo:LabelInfo) => void;
    onRemoveMember?:(memberInfo:MinMemberInfo, labelInfo:LabelInfo) => void;
}