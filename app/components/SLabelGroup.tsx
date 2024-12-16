import { SLabelGroupProps } from "../props/SLabelGroupProps";
import { Box } from "@mui/material";
import { useEffect, useState } from 'react';
import { LabelInfo, ILabelInfo } from "../lib/LabelInfo";
import { group } from "console";
import SScheduledLabel from "./SScheduledLabel";

export default function SLabelGroup(props:SLabelGroupProps) {
    let [labelName, setLabelName] = useState<string>(props.groupInfo?.labelName || '');
    let [childLabels, setChildLabels] = useState<LabelInfo[]>([]);
    let [updateNumber, setUpdateNumber] = useState<number>(props.updateNumber || 0);

    const needsUpdate = () => {
        setUpdateNumber(props.updateNumber || 0);
    }

    const getInitialInfo = async() => {
        if (props.groupInfo !== undefined) {
            setLabelName(props.groupInfo.labelName);
            setChildLabels(props.groupInfo.childLabels);
        }        
    }

    useEffect(() => {
        getInitialInfo();
    }, [props.groupInfo]);

    useEffect(() => {
        needsUpdate();
    }, [props.updateNumber]);

    return (
        <Box>
            {labelName}
            {childLabels.map((item, index) => (                
                <SScheduledLabel key={item.label_id} groupInfo={item} updateNumber={updateNumber} />
            ))}            
        </Box>
    );

}