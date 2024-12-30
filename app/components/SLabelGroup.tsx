import { SLabelGroupProps } from "../props/SLabelGroupProps";
import { Box } from "@mui/material";
import { useEffect, useState } from 'react';
import { LabelInfo } from "../lib/LabelInfo";
import SScheduledLabel from "./SScheduledLabel";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import { Console } from "console";

export default function SLabelGroup(props:SLabelGroupProps) {
    let [labelName, setLabelName] = useState<string>(props.groupInfo?.labelName || '');
    let [childLabels, setChildLabels] = useState<LabelInfo[]>([]);
    let [updateNumber, setUpdateNumber] = useState<number>(props.updateNumber || 0);

    const addMember = (memberInfo:MinMemberInfo, labelInfo:LabelInfo) => {
        if (props.onAddMember) {
            props.onAddMember(memberInfo, labelInfo);
        }
    }

    const removeMember  = (memberInfo:MinMemberInfo, labelInfo:LabelInfo) => {        
        if (props.onRemoveMember) {           
            props.onRemoveMember(memberInfo, labelInfo);
        }
    }

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
                <SScheduledLabel key={item.label_id} groupInfo={item} updateNumber={updateNumber} onAddMember={addMember} onRemoveMember={removeMember} />
            ))}            
        </Box>
    );

}