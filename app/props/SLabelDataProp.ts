import { LabelInfo } from "../lib/LabelInfo";

export interface SLabelDataProp {
    label?: LabelInfo;
    parent?: LabelInfo;
    userId?: string;    
    isCreate: boolean;
    updateLabel?: (lbl:LabelInfo) => void;
}