import LabelInfo from '../lib/LabelInfo';
import { MinMemberInfo } from '../lib/MinMemberInfo';

export interface SMemberListProp {
    labelInfo?:LabelInfo;
    memberList?:MinMemberInfo[];
    title?:string;
    allowRemove?:boolean;
}