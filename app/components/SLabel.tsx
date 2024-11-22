import { SLabelProps } from "../props/SLabelProps";
import { Box, Chip } from "@mui/material";
import { useState, useEffect } from "react";


export default function SLabel(props:SLabelProps) {
    let [scheduledList, setScheduledList] = useState<object[]>([]);

    useEffect(() => {
        const updateShowElements = async () => {
            var scheduledMembers = [];
            if (props.labelInfo?.scheduled != undefined) {
                scheduledMembers = props.labelInfo.scheduled;
            }
            setScheduledList(scheduledMembers);
        }
        
        updateShowElements();
    }, [props.labelInfo]);

    return (
        <>
        <Box>
            {props.labelInfo?.labelName}
            {scheduledList.map((item, index) => (
                // @ts-ignore
                <Chip key={index} label={item.first + " " + item.last} />
            ))}
        </Box>
        </>
    );

}