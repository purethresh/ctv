import { Box, Button, Paper, Typography } from "@mui/material";
import { SLabelInfoProps } from "../props/SLabelInfoProps";
import { useEffect, useState } from 'react';
import SMemberList from "./SMemberList";
import SLabelData from "./SLabelData";
import { LabelInfo } from "../lib/LabelInfo";
import SAllMemberSelect from "./SAllMemberSelect";
import { MinMemberInfo } from "../lib/MinMemberInfo";

export default function SLabelInfo(props:SLabelInfoProps) {
    let [labelName, setLabelName] = useState<string>('');
    let [labelDescription, setLabelDescription] = useState<string>('');
    let [userId, setUserId] = useState<string>('');
    let [labelInfo, setLabelInfo] = useState<LabelInfo>(props.labelInfo || new LabelInfo({}));
    let [isAdmin, setIsAdmin] = useState<boolean>(false);
    let [selectedMember, setSelectedMember] = useState<string>('');
    let [canAddMember, setCanAddMember] = useState<boolean>(false);
    let [canAddOwner, setCanOwner] = useState<boolean>(false);

    const userSelected = async (memberId:string) => {
        setSelectedMember(memberId);
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

    const removeMember = async (memberId:string) => {
        if (props.onRemoveMember){
            props.onRemoveMember(memberId, labelInfo.label_id);
        }
    }

    const deleteLabel = async () => { 
        if (isAdmin && props.onDeleteLabel ) {
            props.onDeleteLabel(labelInfo.label_id);
        }
    }

    const updateLabel = async (lbl:LabelInfo) => {
        if (props.onUpdateLabel) {
            props.onUpdateLabel(lbl);
        }
    }

    const resetState = async () => {
        setLabelName(props.labelInfo?.labelName || '');
        setLabelDescription(props.labelInfo?.labelDescription || '');
        
        const uId = props.userId || '';
        const lbl = props.labelInfo || new LabelInfo({});
        const sMember = uId;

        // Update the add buttons
        const iMember = lbl.isMember(sMember);
        const iOwner = lbl.isOwner(sMember);

        setCanAddMember(!iMember);
        setCanOwner(!iOwner);        

        setIsAdmin(lbl.isOwner(uId));
        setUserId(uId);
        setSelectedMember(sMember);
        setLabelInfo(lbl);
    }

    useEffect(() => {

        resetState();
    }, [props.labelInfo, props.memberList, props.ownerList, props.userId, props.allMembers]);    


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
            <SMemberList labelInfo={labelInfo} memberList={props.memberList} title="Members of" userId={userId} onRemoveMember={removeMember}/>
            <SMemberList labelInfo={labelInfo} memberList={props.ownerList} title="Administrators of" userId={userId} onRemoveMember={removeMember}/>
            <Paper>
                <Box sx={{marginTop: '10px', marginBottom: '10px', paddingBottom: '10px'}}>
                    <SLabelData label={labelInfo} userId={userId} isCreate={false} updateLabel={updateLabel} />
                </Box>                
            </Paper>
            <Paper>
                <Box sx={{marginTop: '10px', marginBottom: '10px', paddingBottom: '10px'}}>
                    <SLabelData parent={labelInfo} userId={userId} isCreate={true} updateLabel={updateLabel}/>
                </Box>
            </Paper>
            <Paper>
                <Box bgcolor={'secondary.main'} sx={{ display:isAdmin ? 'block' : 'none', paddingLeft: '10px', paddingTop: '4px', paddingBottom: '4px', marginBottom: '5px'}}>
                    <Typography variant="h6" color='secondary.contrastText'>Add Member To Label</Typography>
                </Box> 
                <SAllMemberSelect defaultMemberId={userId} onClick={userSelected} isVisible={isAdmin} memberList={props.allMembers} />
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