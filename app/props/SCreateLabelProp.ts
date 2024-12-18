import { LabelInfo } from "../lib/LabelInfo";

export interface SCreateLabelProp {
    parentLabel?: LabelInfo;
    userId?: string;
    churchId?: string;
    onReload?: () => void;
}