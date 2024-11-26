import { Box } from "@mui/material";
import { SLabelInfoProps } from "../props/SLabelInfoProps";
import { useEffect, useState } from 'react';
import SMemberList from "./SMemberList";
import SCreateLabel from "./SCreateLabel";

// TODO JLS
// remove user from label (both as member and owner)

export default function SLabelInfo(props:SLabelInfoProps) {
    let [labelName, setLabelName] = useState<string>('');
    let [labelDescription, setLabelDescription] = useState<string>('');
    let [creator_id, setCreator_id] = useState<string>('');
    let [churchId, setChurchId] = useState<string>('');

    useEffect(() => {
        const calcValues = async () => {
            setLabelName(props.labelInfo?.labelName || '');
            setLabelDescription(props.labelInfo?.labelDescription || '');
            setCreator_id(props.userId || '');
            setChurchId(props.churchId || '');
        }
        
        calcValues();
    }, [props.labelInfo, props.memberList, props.ownerList, props.userId]);    

    return (
        <Box style={{display:props.labelInfo ? 'block' : 'none'}}>
            <div>{labelName}</div>
            <div>{labelDescription}</div>
            <SMemberList labelInfo={props.labelInfo} memberList={props.memberList} title="Members of" />
            <SMemberList labelInfo={props.labelInfo} memberList={props.ownerList} title="Administrators of" />
            <br />
            <SCreateLabel parentLabel={props.labelInfo} createrId={creator_id} churchId={churchId} />
        </Box>
    );
}