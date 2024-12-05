import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { useEffect, useState } from "react";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import SMemberPhoneList from "./SMemberPhoneList";
import SMemberAddressList from "./SMemberAddressList";
import SMemberEmailList from "./SMemberEmailList";
import DoneIcon from '@mui/icons-material/Done';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

export default function SMemberInfo(props:SMemberInfoProp) {
    let [memberId, setMemberId] = useState<string>('');
    let [memberInfo, setMemberInfo] = useState<MinMemberInfo>(new MinMemberInfo({}));
    let [isAdmin, setIsAdmin] = useState<boolean>(false);
    let [isEditing, setIsEditing] = useState<boolean>(false);
    let [isCreating, setIsCreating] = useState<boolean>(false);

    const onSetEditMode = () => {
        setIsEditing(true);
    }

    const onSave = () => {
        // TODO JLS. Save and pass on to other components
        // TODO JLS, reload info so it isn't using cached data
        setIsEditing(false);
    }

    const updateMemberInfo = async() => {
        // If no member Id, then we can't do anything
        if (props.memberId === undefined || props.memberId.length <= 0) {
            return
        }

        const mId = props.memberId;
        setMemberId(mId);

        if (props.isAdmin !== undefined) {
            setIsAdmin(props.isAdmin);
        }

        // Get the member info
        const result = await fetch(`/api/member?member_id=${mId}`, { cache: 'force-cache' });
        var rs = await result.json();
        if (rs.length > 0) { 
            const mInfo = new MinMemberInfo(rs[0]);
            setMemberInfo(mInfo);
        }
    }

    useEffect(() => {
        updateMemberInfo();
    }, [props.memberId, props.isAdmin]);  

    return (
        <>
        <Box>
            <Box style={{display:!isEditing ? 'block' : 'none'}}>
                <Typography>{memberInfo.first} {memberInfo.last}
                    <IconButton onClick={onSetEditMode}>
                        <ModeEditIcon />
                    </IconButton>
                </Typography>
            </Box>
            <Box style={{display:isEditing ? 'block' : 'none'}}>
                <TextField label="First Name" defaultValue={memberInfo.first} />
                <TextField label="Last Name" defaultValue={memberInfo.last} />
            </Box>
            <Box style={{display:!isEditing ? 'block' : 'none'}}>
                <Typography>{memberInfo.notes}</Typography>                
            </Box>
            <Box style={{display:isEditing ? 'block' : 'none'}}>
                <TextField label="Notes" defaultValue={memberInfo.notes}/>
            </Box>                
            <SMemberPhoneList memberId={memberId} isAdmin={isAdmin} isEditing={isEditing} isCreating={isCreating} />
            <SMemberEmailList memberId={memberId} isAdmin={isAdmin} isEditing={isEditing} isCreating={isCreating} />
            <SMemberAddressList memberId={memberId} isAdmin={isAdmin} isEditing={isEditing} isCreating={isCreating} />
            <Box style={{display:isEditing ? 'block' : 'none'}}>
                <Button endIcon={<DoneIcon />} onClick={onSave}>Save</Button>
            </Box>
        </Box>
        <br />
        </>
    );



}