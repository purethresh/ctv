import { SLabelListProps } from "../props/SLabelListProps";
import { useEffect, useState } from 'react';
import { LabelInfo } from "../lib/LabelInfo";
import Chip from '@mui/material/Chip';

export default function SLabelList(props:SLabelListProps) {
    let [labelList, setLabelList] = useState<LabelInfo[]>([]);

    const handleInternalClick = (labelId:string) => {
        if (props.onClick) {
            props.onClick(labelId);
        }
    }

    useEffect(() => {
        const setup = async() => {
            if (props.labelList) {
                setLabelList(props.labelList);
            }
        }
    
        setup();
    }, [props.labelList, props.seletedLabel]);  

    return (
        <>
            {labelList.map((item, index) => (
                <Chip
                    key={item.label_id}
                    label={item.labelName}
                    onClick={(e) => {handleInternalClick(item.label_id)}}
                    color="primary"
                    variant={props.seletedLabel === item.label_id ? 'filled' : 'outlined'}
                />
            ))}
        </>
    );

}