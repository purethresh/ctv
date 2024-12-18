import { Box, Button } from "@mui/material";
import { SLabelInfoProps } from "../props/SLabelInfoProps";
import { useEffect, useState } from 'react';
import SMemberList from "./SMemberList";
import SCreateLabel from "./SCreateLabel";
import { LabelInfo } from "../lib/LabelInfo";
import SAllMemberSelect from "./SAllMemberSelect";

export default function SLabelInfo(props:SLabelInfoProps) {
    let [labelName, setLabelName] = useState<string>('');
    let [labelInfo, setLabelInfo] = useState<LabelInfo>(props.labelInfo || new LabelInfo({}));
    let [labelDescription, setLabelDescription] = useState<string>('');
    let [userId, setUserId] = useState<string>('');
    let [churchId, setChurchId] = useState<string>('');
    let [selectedMember, setSelectedMember] = useState<string>('');
    let [isAdmin, setIsAdmin] = useState<boolean>(false);
    let [canAddMember, setCanAddMember] = useState<boolean>(false);
    let [canAddOwner, setCanOwner] = useState<boolean>(false);

    const removeUser = async (memberId:string) => {
        if (props.onRemoveMember) {
            props.onRemoveMember(memberId, labelInfo.label_id);
        }
    }

    const userSelected = async (memberId:string) => {
        setSelectedMember(memberId);

        // Update the add buttons
        setCanAddMember(!labelInfo.isMember(memberId));
        setCanOwner(!labelInfo.isOwner(memberId));
    }

    const addAsMember = async () => {
        if (canAddMember && props.onAddMember) {
            props.onAddMember(selectedMember, labelInfo.label_id, false);
        }
    }

    const addAsOwner = async () => {
        if (canAddOwner && props.onAddMember) {
            props.onAddMember(selectedMember, labelInfo.label_id, true);
        }
    }

    useEffect(() => {
        const calcValues = async () => {
            setLabelName(props.labelInfo?.labelName || '');
            setLabelDescription(props.labelInfo?.labelDescription || '');

            const userId = props.userId || '';
            setUserId(userId);
            setChurchId(props.churchId || '');

            const lbl = props.labelInfo || new LabelInfo({});
            setLabelInfo(lbl);

            if (lbl.isOwner(userId)) {
                setIsAdmin(true);
            }
        }
        
        calcValues();
    }, [props.labelInfo, props.memberList, props.ownerList, props.userId]);    

    return (
        <Box style={{display:props.labelInfo ? 'block' : 'none'}}>
            <div>{labelName}</div>
            <div>{labelDescription}</div>
            <SMemberList labelInfo={props.labelInfo} memberList={props.memberList} title="Members of" userId={userId} onRemoveMember={removeUser}/>
            <SMemberList labelInfo={props.labelInfo} memberList={props.ownerList} title="Administrators of" userId={userId} onRemoveMember={removeUser}/>
            <br />
            <SCreateLabel parentLabel={props.labelInfo} userId={userId} churchId={churchId} onReload={props.onReload} />

            <SAllMemberSelect churchId={props.labelInfo?.church_id} defaultMemberId={userId} onClick={userSelected} isVisible={isAdmin} />
            <Button onClick={addAsMember} style={{display:isAdmin && canAddMember ? 'block' : 'none'}}>Add As Member</Button>
            <Button onClick={addAsOwner} style={{display:isAdmin && canAddOwner ? 'block' : 'none'}}>Add As Owner</Button>
        </Box>
    );
}