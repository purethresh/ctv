import { LabelInfo } from "../lib/LabelInfo";

export interface SLabelChipProps {
    labelInfo?:LabelInfo;
    userId?:string;
    onClick?:(labelInfo:LabelInfo) => void;
}