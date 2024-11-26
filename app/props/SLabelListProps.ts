import LabelInfo from '../lib/LabelInfo';

export interface SLabelListProps {
    labelList?:LabelInfo[];
    seletedLabel?:string;
    onClick?:(labelId:string) => void;
}