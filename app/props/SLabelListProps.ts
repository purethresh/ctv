import ChurchLabels from '../lib/ChurchLabels';
import { LabelInfo } from '../lib/LabelInfo';

export interface SLabelListProps {
    labelList?:LabelInfo[];
    seletedLabel?:string;
    userId?:string;
    onClick?:(labelId:string) => void;
}