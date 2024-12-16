import { LabelInfo } from '../lib/LabelInfo';
import { MinMemberInfo } from '../lib/MinMemberInfo';

export interface SLabelInfoProps {
    labelInfo?:LabelInfo;
    memberList?:MinMemberInfo[];
    ownerList?:MinMemberInfo[];
    userId?:string;
    churchId?:string;
    onReload?:() => void;
}