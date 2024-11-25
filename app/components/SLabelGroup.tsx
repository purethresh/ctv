import { SLabelGroupProps } from "../props/SLabelGroupProps";
import { Box } from "@mui/material";
import { useEffect, useState } from 'react';
import LabelInfo from "../lib/LabelInfo";
import SLabel from "./SLabel";

export default function SLabelGroup(props:SLabelGroupProps) {
    let [shouldShowTitle, setShouldShowTitle] = useState<boolean>(false);
    let [childLabels, setChildLabels] = useState<LabelInfo[]>([]);

    useEffect(() => {
        const updateShowElements = async () => {
            const isNotRoot = props.groupInfo?.owner_id != undefined && props.groupInfo?.owner_id.length > 0;
            setShouldShowTitle(isNotRoot);

            var labelInfo:LabelInfo[] = [];
            if (props.groupInfo?.childLabels != undefined) {
                labelInfo = props.groupInfo.childLabels;
            }
            setChildLabels(labelInfo);
        }
        
        updateShowElements();
    }, [props.groupInfo]);

    return (
        <>
            <Box style={{display:shouldShowTitle ? 'block' : 'none'}}>{props.groupInfo?.labelName}</Box>
            {childLabels.map((item, index) => (
              <SLabel key={index} labelInfo={item} admin={true} compact={true} />
            ))}
        </>
    );

}