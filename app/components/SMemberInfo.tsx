import { Box, Typography, TextField, Button, IconButton, Paper, Grid2, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { useEffect, useState } from "react";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import SMemberPhoneList from "./SMemberPhoneList";
import SMemberAddressList from "./SMemberAddressList";
import SMemberEmailList from "./SMemberEmailList";
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { v4 } from 'uuid';
import { API_CALLS, APIHandler } from "../lib/APIHanlder";

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

    const onCancel = async () => {
        setIsEditing(false);
    }

    const onSave = async () => {
        if (needsSave) {
            const api = new APIHandler();
            const mInfo = memberInfo;
            const params = {
                member_id: memberId,
                first: mInfo.first,
                last: mInfo.last,
                notes: mInfo.notes,
                gender: mInfo.gender
            }

            if (isCreating) {
                // @ts-ignore
                params.church_id = churchId;
                await api.createData(API_CALLS.member, params);
            }   
            else {
                await api.postData(API_CALLS.member, params);
            }

            // fetch without cache to update
            await api.getData(API_CALLS.member, {member_id: memberId}, false);

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

    const updateGender = (event: React.ChangeEvent<HTMLInputElement>) => {
        const mInfo = memberInfo;
        mInfo.gender = (event.target as HTMLInputElement).value;
        setMemberInfo(mInfo);
        setNeedsSave(true);
    };    

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
            const api = new APIHandler();
            const result = await api.getData(API_CALLS.member, { member_id: mId }, useCache);
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
        <Box sx={{paddingTop:'5px'}}>
            <Paper>
            <Grid2 container>
                <Grid2 size={12}>
                    <Box bgcolor='secondary.main' style={{display:!isEditing ? 'block' : 'none'}}>
                        <Typography variant="h6" color='secondary.contrastText'>{memberInfo.first} {memberInfo.last}
                            <IconButton onClick={onSetEditMode}>
                                <ModeEditIcon color='primary' />
                            </IconButton>
                        </Typography>
                    </Box>
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <Box style={{display:isEditing ? 'block' : 'none'}}>
                        <TextField sx={{margin: '5px', padding: '10px'}} label="First Name" defaultValue={memberInfo.first} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateFirstName(event.target.value); }} />
                        <br />
                        <TextField label="Last Name" defaultValue={memberInfo.last} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateLastName(event.target.value); }} />
                    </Box>
                    <Box style={{display:!isEditing ? 'block' : 'none'}}>
                        <Typography variant='subtitle1' color="primary.contrastText">{memberInfo.notes}</Typography>                
                    </Box>
                    <Box style={{display:isEditing ? 'block' : 'none'}}>
                        <TextField sx={{margin: '5px', padding: '10px'}} label="Notes" defaultValue={memberInfo.notes} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateNotes(event.target.value); }}/>
                    </Box>
                    <Box style={{display:isEditing ? 'block' : 'none'}}>
                        <FormLabel id="gender_label">Gender</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="gender_label"
                            defaultValue={memberInfo.gender}
                            onChange={updateGender}
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="female" control={<Radio color="secondary" />} label="Female" />
                            <FormControlLabel value="male" control={<Radio color="secondary" />} label="Male" />
                        </RadioGroup>
                    </Box>
                </Grid2>
                <SMemberPhoneList memberId={memberId} isAdmin={isAdmin} isEditing={isEditing} isCreating={isCreating} needsSave={phoneNeedsSave} onSaveComplete={onPhoneSave} />
                <SMemberEmailList memberId={memberId} isAdmin={isAdmin} isEditing={isEditing} isCreating={isCreating} needsSave={emailNeedsSave} onSaveComplete={onEmailSave}/>
                <SMemberAddressList memberId={memberId} isAdmin={isAdmin} isEditing={isEditing} isCreating={isCreating} needsSave={addressNeedsSave} onSaveComplete={onAddressSave}/>
                <Box style={{display:isEditing ? 'block' : 'none'}}>
                    <Button variant="contained" color='secondary' endIcon={<CancelIcon />} onClick={onCancel}>Cancel</Button>
                    <Button variant="contained" color='secondary' endIcon={<DoneIcon />} onClick={onSave}>Save</Button>
                </Box>
            </Grid2>
            </Paper>
        </Box>
    );



}