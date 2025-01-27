import { LabelInfo } from "../lib/LabelInfo";

export interface SLabelDataProp {
    label?: LabelInfo;
    parent?: LabelInfo;
    userId?: string;
    churchId?: string;
    onReload?: () => void;
    isCreate: boolean;
}