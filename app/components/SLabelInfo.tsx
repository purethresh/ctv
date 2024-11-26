import { SLabelProps } from "../props/SLabelProps";
import { Box, Chip } from "@mui/material";
import { SLabelInfoProps } from "../props/SLabelInfoProps";
import { useEffect, useState } from 'react';
import SMemberList from "./SMemberList";

// TODO JLS - HERE
// Show list of members, so we can add them (either as a member or an owner)
// Add a child label
// remove user from member or owner

export default function SLabelInfo(props:SLabelInfoProps) {
    let [labelName, setLabelName] = useState<string>('');
    let [labelDescription, setLabelDescription] = useState<string>('');

    useEffect(() => {
        const calcValues = async () => {
            setLabelName(props.labelInfo?.labelName || '');
            setLabelDescription(props.labelInfo?.labelDescription || '');
        }
        
        calcValues();
    }, [props.labelInfo, props.memberList, props.ownerList]);    

    return (
        <Box style={{display:props.labelInfo ? 'block' : 'none'}}>
            <div>{labelName}</div>
            <div>{labelDescription}</div>
            <SMemberList labelInfo={props.labelInfo} memberList={props.memberList} title="Members of" />
            <SMemberList labelInfo={props.labelInfo} memberList={props.ownerList} title="Administrators of" />            
        </Box>
    );



}