import { LabelInfo } from "../lib/LabelInfo";

export interface SCreateLabelProp {
    parentLabel?: LabelInfo;
    createrId?: string;
    churchId?: string;
    onReload?: () => void;
}