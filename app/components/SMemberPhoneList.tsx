import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { Box, Typography, Button, TextField, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { MemberPhoneInfo } from "../lib/MemberPhoneInfo";
import { v4 } from 'uuid';

export default function SMemberPhoneList(props:SMemberInfoProp) {
    let [memberId, setMemberId] = useState<string>('');
    let [phoneList, setPhoneList] = useState<MemberPhoneInfo[]>([]);
    let [isDirty, setIsDirty] = useState<boolean>(false);
    let [isEditing, setIsEditing] = useState<boolean>(props.isEditing ? true : false);

    const onAddPhone = () => {
        const pInfo = new MemberPhoneInfo({});
        pInfo.phone_id = v4();
        pInfo.member_id = memberId;

        const lst = Array.from(phoneList);
        lst.push(pInfo);

        setPhoneList(lst);
        setIsDirty(true);
    }

    const updatePhoneNumber = (pId:string, pNumber:string) =>{
        // TODO JLS
    }

    const updateIsPrimary = (pId:string, isPrimary:boolean) => {
        // TODO JLS
    }
    
    const onSave = async() => {
        // Ignore if we are not editing
        if (props.needsSave === false) {
            return;
        }

        if (!isDirty) {
            // No need to save, so inform parent that save is done
            if (props.onSaveComplete) {
                props.onSaveComplete();
            }
            return;
        }
        else {
            // Save goes here
        }        
    }

    // TODO JLS
    // Need to create a map of items that need to be created and another map for those that need updating
    // Then need to handle save when needsSave is true
    // Finially need to call onSaveComplete when saving is done

    const updateIsEditing = () => {
        const editing = props.isEditing ? true : false;

        if (editing !== isEditing) {
            setIsEditing(editing);
        }
    }

    const updateMemberInfo = async() => {
        
        // If no member Id, then we can't do anything
        if (props.memberId === undefined || props.memberId.length <= 0) {
            return
        }

        const mId = props.memberId;
        setMemberId(mId);

        // Get the member info
        const result = await fetch(`/api/member/phone?member_id=${mId}`, { cache: 'force-cache' });
        var rs = await result.json();

        if (rs.length > 0) {
            setPhoneList(rs);
        }
        else {
            setPhoneList([]);
        }
    }

    useEffect(() => {
        updateMemberInfo();
    }, [props.memberId, props.isAdmin]);
    
    useEffect(() => {
        updateIsEditing();
    }, [props.isEditing]);

    useEffect(() => {
        onSave();
    }, [props.needsSave]);      

    return (
        <>
            {phoneList.map((pInfo, index) => (
                <Box key={index}>
                    <Typography style={{display:isEditing ? 'none' : 'block'}}>{pInfo.pNumber}</Typography>
                    <TextField style={{display:isEditing ? 'block' : 'none'}} label="Phone Number" defaultValue={pInfo.pNumber} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updatePhoneNumber(pInfo.phone_id, event.target.value); }} />
                    <Checkbox style={{display:isEditing ? 'block' : 'none'}} defaultChecked={pInfo.isPrimary === 'true'} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateIsPrimary(pInfo.phone_id, event.target.checked); }} />
                </Box>
            ))}         
            <Button onClick={onAddPhone} style={{display:isEditing ? 'block' : 'none'}}>Add Phone</Button>
        </>
    );
}