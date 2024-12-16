import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { useEffect, useState } from "react";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import SMemberPhoneList from "./SMemberPhoneList";
import SMemberAddressList from "./SMemberAddressList";
import SMemberEmailList from "./SMemberEmailList";
import DoneIcon from '@mui/icons-material/Done';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { v4 } from 'uuid';

export default function SMemberInfo(props:SMemberInfoProp) {
    let [memberId, setMemberId] = useState<string>('');
    let [userId, setUserId] = useState<string>('');
    let [churchId, setChurchId] = useState<string>('');
    let [memberInfo, setMemberInfo] = useState<MinMemberInfo>(new MinMemberInfo({}));
    let [isAdmin, setIsAdmin] = useState<boolean>(false);
    let [isEditing, setIsEditing] = useState<boolean>(false);
    let [isCreating, setIsCreating] = useState<boolean>(props.isCreating || false);
    let [needsSave, setNeedsSave] = useState<boolean>(false);

    let [phoneNeedsSave, setPhoneNeedsSave] = useState<boolean>(false);
    let [emailNeedsSave, setEmailNeedsSave] = useState<boolean>(false);
    let [addressNeedsSave, setAddressNeedsSave] = useState<boolean>(false);

    const onSetEditMode = () => {
        setIsEditing(true);
    }

    const onSave = async () => {
        if (needsSave) {
            const req: RequestInit = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberInfo)
            }

            // If creating, change to a put
            if (isCreating) {
                req.method = 'PUT';
            }

            // Do the request
            await fetch(`/api/member?church_id=${churchId}`, req);

            // fetch without cache to update
            await fetch(`/api/member?member_id=${memberInfo.member_id}`);

            // Inform parent if it was created
            if (isCreating) {
                if (props.onMemberCreated) {
                    props.onMemberCreated();
                }
                setIsCreating(false);
            }
        }
        
        // Flag children that they need to be saved
        setPhoneNeedsSave(true);
        setEmailNeedsSave(true);
        setAddressNeedsSave(true);
        
        setIsEditing(false);
        setNeedsSave(false);
    }

    const onPhoneSave = () => {
        setPhoneNeedsSave(false);
    }

    const onEmailSave = () => {
        setEmailNeedsSave(false);
    }

    const onAddressSave = () => {
        setAddressNeedsSave(false);
    }

    const updateFirstName = (name:string) => {
        const mInfo = memberInfo;
        mInfo.first = name;
        setMemberInfo(mInfo);
        setNeedsSave(true);
    }

    const updateLastName = (name:string) => {
        const mInfo = memberInfo;
        mInfo.last = name;
        setMemberInfo(mInfo);
        setNeedsSave(true);
    }

    const updateNotes = (notes:string) => {
        const mInfo = memberInfo;
        mInfo.notes = notes;
        setMemberInfo(mInfo);
        setNeedsSave(true);
    }    

    const updateMemberInfo = async(useCache:boolean) => {
        setUserId(props.userId || '');
        const mId = props.memberId || '';
        setMemberId(mId);
        if (props.isAdmin !== undefined) {
            setIsAdmin(props.isAdmin);
        }

        // Set the church id
        setChurchId(props.churchId || '');

        // Get the member info
        const create = props.isCreating || false;
        setIsCreating(create);
        if (!create) {
            let cObj:RequestInit | undefined = undefined;
            if (useCache) {
                cObj = { cache: 'force-cache' };
            }
            const result = await fetch(`/api/member?member_id=${mId}`, cObj);
            var rs = await result.json();
            if (rs.length > 0) { 
                const mInfo = new MinMemberInfo(rs[0]);
                setMemberInfo(mInfo);
            }
        }
        else {
            const mInfo = new MinMemberInfo({ member_id: v4() });
            setMemberId(mInfo.member_id);
            setMemberInfo(mInfo);
            setIsEditing(true);
        }
    }

    useEffect(() => {
        updateMemberInfo(true);
    }, [props.memberId, props.isAdmin, props.isCreating, props.churchId, props.updateNumber]);  

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
                <TextField label="First Name" defaultValue={memberInfo.first} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateFirstName(event.target.value); }} />
                <TextField label="Last Name" defaultValue={memberInfo.last} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateLastName(event.target.value); }} />
            </Box>
            <Box style={{display:!isEditing ? 'block' : 'none'}}>
                <Typography>{memberInfo.notes}</Typography>                
            </Box>
            <Box style={{display:isEditing ? 'block' : 'none'}}>
                <TextField label="Notes" defaultValue={memberInfo.notes} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateNotes(event.target.value); }}/>
            </Box>                
            <SMemberPhoneList memberId={memberId} isAdmin={isAdmin} isEditing={isEditing} isCreating={isCreating} needsSave={phoneNeedsSave} onSaveComplete={onPhoneSave} />
            <SMemberEmailList memberId={memberId} isAdmin={isAdmin} isEditing={isEditing} isCreating={isCreating} needsSave={emailNeedsSave} onSaveComplete={onEmailSave}/>
            <SMemberAddressList memberId={memberId} isAdmin={isAdmin} isEditing={isEditing} isCreating={isCreating} needsSave={addressNeedsSave} onSaveComplete={onAddressSave}/>
            <Box style={{display:isEditing ? 'block' : 'none'}}>
                <Button endIcon={<DoneIcon />} onClick={onSave}>Save</Button>
            </Box>
        </Box>
        <br />
        </>
    );



}