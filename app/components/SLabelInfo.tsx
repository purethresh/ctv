import { Box, Button, Paper, Typography } from "@mui/material";
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

    const deleteLabel = async () => { 
        if (isAdmin && props.onDeleteLabel ) {
            props.onDeleteLabel(labelInfo.label_id);
        }
    }

    useEffect(() => {
        const calcValues = async () => {
            var lblName = props.labelInfo?.labelName || '';
            lblName = lblName;
            setLabelName(lblName);
            setLabelDescription(props.labelInfo?.labelDescription || '');

            const userId = props.userId || '';
            setUserId(userId);
            setChurchId(props.churchId || '');

            if (selectedMember === '') {
                setSelectedMember(userId);
                await userSelected(userId);
            }

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
            <Paper>
                <Box style={{paddingBottom: '10px', textAlign: 'center'}}>
                    <Box bgcolor={'secondary.main'}>
                        <Typography variant="h6" color='secondary.contrastText'>{labelName}</Typography>
                    </Box>                    
                    <Box bgcolor={'secondary.dark'}>
                        <Typography variant="h6" color='secondary.contrastText'>{labelDescription}</Typography>
                    </Box>                    
                </Box>
            </Paper>
            <SMemberList labelInfo={props.labelInfo} memberList={props.memberList} title="Members of" userId={userId} onRemoveMember={removeUser}/>
            <SMemberList labelInfo={props.labelInfo} memberList={props.ownerList} title="Administrators of" userId={userId} onRemoveMember={removeUser}/>
            <Paper>
                <Box sx={{marginTop: '10px', marginBottom: '10px', paddingBottom: '10px'}}>
                    <SCreateLabel parentLabel={props.labelInfo} userId={userId} churchId={churchId} onReload={props.onReload} />
                </Box>
            </Paper>
            <Paper>
                <Box bgcolor={'secondary.main'} sx={{ display:isAdmin ? 'block' : 'none', paddingLeft: '10px', paddingTop: '4px', paddingBottom: '4px', marginBottom: '5px'}}>
                    <Typography variant="h6" color='secondary.contrastText'>Add Member To Label</Typography>
                </Box> 
                <SAllMemberSelect churchId={props.labelInfo?.church_id} defaultMemberId={userId} onClick={userSelected} isVisible={isAdmin} />
                <Button onClick={addAsMember} style={{display:isAdmin && canAddMember ? 'block' : 'none'}} variant='contained' color='secondary'>Add As Member</Button>
                <Button onClick={addAsOwner} style={{display:isAdmin && canAddOwner ? 'block' : 'none'}} variant='contained' color='secondary'>Add As Owner</Button>
            </Paper>
            <Paper>
                <Box sx={{ display:isAdmin ? 'block' : 'none', paddingTop: '4px', paddingBottom: '4px', marginBottom: '5px', marginTop: '10px'}}>
                    <Button onClick={deleteLabel} style={{display:isAdmin && canAddOwner ? 'block' : 'none'}} variant='contained' color='secondary'>Delete Label</Button>
                </Box>
            </Paper>
        </Box>
    );
}