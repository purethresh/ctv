import { SLabelListProps } from "../props/SLabelListProps";
import { useEffect, useState } from 'react';
import { LabelInfo } from "../lib/LabelInfo";
import SLabelChip from "./SLabelChip";
import { Box } from "@mui/material";


export default function SLabelList(props:SLabelListProps) {
    let [labelList, setLabelList] = useState<LabelInfo[]>([]);
    let [userId, setUserId] = useState<string>('');

    const setup = () => {
        const lblList = props.labelList || [];
        setLabelList(lblList);
        setUserId(props.userId || '');
    }

    const onLabelClick = (label:LabelInfo) => {
        if (props.onClick) {
            props.onClick(label.label_id);
        }
    }

    useEffect(() => {
        setup();
    }, [props.labelList, props.userId]); 

    return (
        <>
        {labelList.map((item, index) => (
            <SLabelChip key={item.label_id + '_label'} labelInfo={item} userId={userId} onClick={onLabelClick} />
        ))}
        </>
    )
}