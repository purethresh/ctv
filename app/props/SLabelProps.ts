import { LabelInfo } from "../lib/LabelInfo";

export interface SLabelProps {
    labelInfo?:LabelInfo;
    compact?:boolean;
    admin?:boolean;
    onClick?:(labelInfo:LabelInfo) => void;
}