import { SLabelChipProps } from "../props/SLabelChipProps";
import { Button } from "@mui/material";
import { useEffect, useState } from 'react';
import { LabelInfo } from "../lib/LabelInfo";

export default function SLabelChip(props:SLabelChipProps) {
    let [info, setInfo] = useState<LabelInfo>(new LabelInfo({}));
    let [labelName, setLabelName] = useState<string>('');
    let [colorName, setColorName] = useState<string>('primary');

    const onClickedButton = () => {
        if (props.onClick) {
            props.onClick(info);
        }
    }

    const setup = () => {
        const lblInfo = props.labelInfo || new LabelInfo({});
        setInfo(lblInfo);

        const uId = props.userId || '';

        setLabelName(lblInfo.labelName);

        const isMember = lblInfo.isMember(uId);
        const isOwner = lblInfo.isOwner(uId);

        if (isOwner && isMember) {
            setColorName('success');
        }
        else if (isOwner) {
            setColorName('secondary');
        }
        else {
            setColorName('primary');
        }
    }


    useEffect(() => {
        setup();
    }, [props.labelInfo, props.userId]);

    return (
        // @ts-ignore
        <Button variant="contained" color={colorName} sx={{borderRadius:'15px', marginLeft: '5px', marginRight: '5px'}} onClick={onClickedButton}>{labelName}</Button>
    );



}