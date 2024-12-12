import { SLabelGroupProps } from "../props/SLabelGroupProps";
import { Box } from "@mui/material";
import { useEffect, useState } from 'react';
import { LabelInfo, ILabelInfo } from "../lib/LabelInfo";
import { group } from "console";
import SScheduledLabel from "./SScheduledLabel";

export default function SLabelGroup(props:SLabelGroupProps) {
    let [groupInfo, setGroupInfo] = useState<LabelInfo>(props.groupInfo || new LabelInfo({}));

    const getInitialInfo = async() => {
        if (props.groupInfo !== undefined) {
            setGroupInfo(props.groupInfo);
        }        
    }

    useEffect(() => {
        getInitialInfo();
    }, [props.groupInfo]);

    return (
        <Box>
            {groupInfo.labelName}

            {groupInfo.childLabels.map((item, index) => (
                <SScheduledLabel key={item.label_id} groupInfo={item} />
            ))}            
        </Box>
    );

}