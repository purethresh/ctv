import { Box, Typography, TextField, Button, IconButton, Paper, Grid2, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { useEffect, useState } from "react";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import SMemberPhoneList from "./SMemberPhoneList";
import SMemberAddressList from "./SMemberAddressList";
import SMemberEmailList from "./SMemberEmailList";
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import LinkIcon from '@mui/icons-material/Link';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { MemberPhoneInfo } from "../lib/MemberPhoneInfo";
import { MemberEmailInfo } from "../lib/MemberEmailInfo";
import { MemberAddressInfo } from "../lib/MemberAddressInfo";

export default function SMemberInfo(props:SMemberInfoProp) {
    let [memberInfo, setMemberInfo] = useState<MinMemberInfo>(props.memberInfo || new MinMemberInfo({}));
    let [isAdmin, setIsAdmin] = useState<boolean>(props.isAdmin || false);
    let [isEditing, setIsEditing] = useState<boolean>(props.isEditing || false);

    let [currentGender, setCurrentGender] = useState<string>('male');
    let [currentFirst, setCurrentFirst] = useState<string>('');
    let [currentLast, setCurrentLast] = useState<string>('');
    let [currentNotes, setCurrentNotes] = useState<string>('');

    let [phoneList, setPhoneList] = useState<MemberPhoneInfo[]>([]);
    let [emailList, setEmailList] = useState<MemberEmailInfo[]>([]);
    let [addressList, setAddressList] = useState<MemberAddressInfo[]>([]);

    let [updatedPhoneList, setUpdatedPhoneList] = useState<MemberPhoneInfo[]>([]);
    let [updatedEmailList, setUpdatedEmailList] = useState<MemberEmailInfo[]>([]);
    let [updatedAddressList, setUpdatedAddressList] = useState<MemberAddressInfo[]>([]);

    let [isLinked, setIsLinked] = useState<boolean>(false);

    const onSetEditMode = () => {
        resetState(props.memberInfo);
        setIsEditing(true);
    }

    const onCancel = async () => {
        if (props.onCancel) {
            props.onCancel();
        }
        setIsEditing(false);
    }

    const onSave = async () => {
        if (props.saveMemberInfo) {
            props.saveMemberInfo(memberInfo, updatedPhoneList, updatedAddressList, updatedEmailList);
        }
    }

    const onRemoveLink = async () => {
        if (props.onRemoveLink) {
            props.onRemoveLink(memberInfo.member_id);
        }
        memberInfo.sub = '';
        setMemberInfo(memberInfo);
    }

    // -----------------------------------------------------
    // Get updated lists 
    // -----------------------------------------------------
    const onUpdatePhoneList = (list:MemberPhoneInfo[]) => {
        setUpdatedPhoneList(list);
    }

    const onUpdateEmailList = (list:MemberEmailInfo[]) => {
        setUpdatedEmailList(list);
    }

    const onUpdateAddressList = (list:MemberAddressInfo[]) => {
        setUpdatedAddressList(list);
    }

    // -----------------------------------------------------
    // Update member info
    // -----------------------------------------------------

    const updateFirstName = (name:string) => {
        const mInfo = memberInfo;
        mInfo.first = name;
        setCurrentFirst(mInfo.first);        
        setMemberInfo(mInfo);
    }

    const updateLastName = (name:string) => {
        const mInfo = memberInfo;
        mInfo.last = name;
        setCurrentLast(mInfo.last);
        setMemberInfo(mInfo);
    }

    const updateNotes = (notes:string) => {
        const mInfo = memberInfo;
        mInfo.notes = notes;
        setCurrentNotes(mInfo.notes);
        setMemberInfo(mInfo);
    }

    const updateGender = (event: React.ChangeEvent<HTMLInputElement>) => {
        const mInfo = memberInfo;
        mInfo.gender = (event.target as HTMLInputElement).value;
        setCurrentGender(mInfo.gender);
        setMemberInfo(mInfo);
    };

    const resetState = (mInfo:MinMemberInfo) => {
        setMemberInfo(mInfo);
        setIsAdmin(props.isAdmin || false);
        setIsEditing(props.isEditing || false);
        setPhoneList(props.phoneList || []);
        setEmailList(props.emailList || []);
        setAddressList(props.addressList || []);
        setIsLinked(mInfo.isLinked() || false);
        setCurrentGender(mInfo.gender);
        setCurrentFirst(mInfo.first);
        setCurrentLast(mInfo.last);
        setCurrentNotes(mInfo.notes);
    }

    useEffect(() => {
        resetState(props.memberInfo);
    }, [props.memberInfo, props.isAdmin, props.isEditing]);  

    return (
        <Box sx={{paddingTop:'5px'}}>
            <Paper>
            <Grid2 container>
                <Grid2 size={12}>
                    <Box bgcolor='secondary.main' style={{display:!isEditing ? 'block' : 'none'}}>
                        <Typography variant="h6" color='secondary.contrastText'>{currentFirst} {currentLast}
                            <IconButton onClick={onSetEditMode}>
                                <ModeEditIcon color='primary' />
                            </IconButton>
                        </Typography>
                    </Box>
                </Grid2>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <Box style={{display:isEditing ? 'block' : 'none'}}>
                        <TextField sx={{margin: '5px', padding: '10px'}} label="First Name" defaultValue={currentFirst} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateFirstName(event.target.value); }} />
                        <br />
                        <TextField label="Last Name" defaultValue={currentLast} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateLastName(event.target.value); }} />
                    </Box>
                    <Box style={{display:!isEditing ? 'block' : 'none'}}>
                        <Typography variant='subtitle1' color="primary.contrastText">{currentNotes}</Typography>                
                    </Box>
                    <Box style={{display:isEditing ? 'block' : 'none'}}>
                        <TextField sx={{margin: '5px', padding: '10px'}} label="Notes" defaultValue={currentNotes} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateNotes(event.target.value); }}/>
                    </Box>
                    <Box style={{display:isEditing ? 'block' : 'none'}}>
                        <FormLabel id="gender_label">Gender</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="gender_label"
                            value={currentGender}
                            onChange={updateGender}
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="female" control={<Radio color="secondary" />} label="Female" />
                            <FormControlLabel value="male" control={<Radio color="secondary" />} label="Male" />
                        </RadioGroup>
                    </Box>
                </Grid2>
                <SMemberPhoneList memberInfo={memberInfo} phoneList={phoneList} onUpdatePhoneList={onUpdatePhoneList} isAdmin={isAdmin} isEditing={isEditing} />
                <SMemberEmailList memberInfo={memberInfo} emailList={emailList} onUpdateEmailList={onUpdateEmailList} isAdmin={isAdmin} isEditing={isEditing} />
                <SMemberAddressList memberInfo={memberInfo} addressList={addressList} onUpdateAddressList={onUpdateAddressList} isAdmin={isAdmin} isEditing={isEditing}/>
                <Box style={{display:isEditing ? 'block' : 'none'}}>
                    <Button variant="contained" color='secondary' endIcon={<CancelIcon />} onClick={onCancel}>Cancel</Button>
                    <Button variant="contained" color='secondary' endIcon={<DoneIcon />} onClick={onSave}>Save</Button>
                </Box>
                <Box style={{display:isEditing && isAdmin && isLinked ? 'block' : 'none'}}>
                    <Button variant="contained" color='secondary' endIcon={<LinkIcon />} onClick={onRemoveLink}>Remove User Link</Button>
                </Box>                
            </Grid2>
            </Paper>
        </Box>
    );



}