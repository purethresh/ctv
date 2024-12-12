import { SLabelGroupProps } from "../props/SLabelGroupProps";
import { Box, FormLabelPropsColorOverrides } from "@mui/material";
import { useEffect, useState } from 'react';
import { LabelInfo, ILabelInfo } from "../lib/LabelInfo";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import SLabelMember from "./SLabelMember";

export default function SScheduledLabel(props:SLabelGroupProps) {
    let [labelInfo, setLabelInfo] = useState<LabelInfo>(props.groupInfo || new LabelInfo({}));
    let [memberList, setMemberList] = useState<MinMemberInfo[]>([]);
    // TODO JLS
    // Show Label Name
    // Show list of scheduled members
    // Show list of suggested members
    // Show list of members
    // show list of blocked out members

    const getInitialInfo = async() => {
        if (props.groupInfo !== undefined) {
            const lbl = props.groupInfo;
            setLabelInfo(lbl);
            setMemberList(lbl.getMemberList());
        }        
    }

    useEffect(() => {
        getInitialInfo();
    }, [props.groupInfo]);


    return (
        <Box>
            {labelInfo.labelName}

            {memberList.map((item, index) => (
                <SLabelMember key={item.member_id + labelInfo.label_id}/>
            ))}               
        </Box>
    );



}