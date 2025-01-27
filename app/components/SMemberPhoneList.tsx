import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { Box, Typography, Button, TextField, Checkbox, Grid2 } from "@mui/material";
import { useEffect, useState } from "react";
import { MemberPhoneInfo } from "../lib/MemberPhoneInfo";
import { v4 } from 'uuid';
import { UpdateType } from "../lib/UpdateType";
import { API_CALLS, APIHandler } from "../lib/APIHanlder";
import { Grid } from "@aws-amplify/ui-react";

export default function SMemberPhoneList(props:SMemberInfoProp) {
    let [memberId, setMemberId] = useState<string>('');
    let [phoneMap, setPhoneMap] = useState<Map<string, MemberPhoneInfo>>(new Map<string, MemberPhoneInfo>());
    let [phoneList, setPhoneList] = useState<MemberPhoneInfo[]>([]);
    let [isDirty, setIsDirty] = useState<boolean>(false);
    let [isEditing, setIsEditing] = useState<boolean>(props.isEditing ? true : false);
    let [isCreating, setIsCreating] = useState<boolean>(props.isCreating ? true : false);
    let [updateMap, setUpdateMap] = useState<Map<string, UpdateType>>(new Map<string, UpdateType>());    

    const onAddPhone = () => {
        const pInfo = new MemberPhoneInfo({});
        pInfo.phone_id = v4();
        pInfo.member_id = memberId;

        // Add to the list
        const mp = phoneMap;
        mp.set(pInfo.phone_id, pInfo);       

        // Track the operation
        if (updateMap.has(pInfo.phone_id) === false) {
            updateMap.set(pInfo.phone_id, UpdateType.create);
        }

        setPhoneMap(mp);
        setPhoneList(Array.from(mp.values()));
        setIsDirty(true);
    }

    const updatePhoneNumber = (pId:string, pNumber:string) =>{
        // Get the phone info
        const pInfo = phoneMap.get(pId);

        if (pInfo) {
            pInfo.pNumber = pNumber;

            // Track the operation
            if (!updateMap.has(pId)) {
                updateMap.set(pId, UpdateType.update);
            }

            // Update is needed!
            setIsDirty(true);
        }
    }

    const updateIsPrimary = (pId:string, isPrimary:boolean) => {
        // Get the phone info
        const pInfo = phoneMap.get(pId);

        if (pInfo) {
            pInfo.isPrimary = isPrimary ? 'true' : 'false';

            // Track the operation
            if (!updateMap.has(pId)) {
                updateMap.set(pId, UpdateType.update);
            }

            // Update is needed!
            setIsDirty(true);
        }
    }

    const saveElement = async(phoneId:string, updateType:UpdateType) => {
        // Get the phone info
        const pInfo = phoneMap.get(phoneId);
        
        // If it is not found, then we can't do anything
        if (pInfo === undefined) {
            return;
        }

        const api = new APIHandler();        

        switch (updateType) {
            case UpdateType.create:
                await api.createData(API_CALLS.phone, pInfo);
                break;
            case UpdateType.update:
                await api.postData(API_CALLS.phone, pInfo);
                break;
            default:
                // Nothing else is currently implemented
        }
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
            // Convert the map to an array (so we can use await)
            const ray = Array.from(updateMap.entries());
            
            for (var i=0; i<ray.length; i++) {
                const pId = ray[i][0];
                const uType = ray[i][1];
                await saveElement(pId, uType);
            }
            
            // Clear the map
            updateMap.clear();

            // Now clear the dirty flag
            setIsDirty(false);

            // Inform that save is done
            if (props.onSaveComplete) {
                props.onSaveComplete();
            }
        }        
    }

    const updateIsEditing = () => {
        const editing = props.isEditing ? true : false;
        const creating = props.isCreating ? true : false;
        setIsCreating(creating);

        if (editing !== isEditing) {
            setIsEditing(editing);            

            if (creating) {                
                const mp = phoneMap;
                mp.clear();
                setPhoneMap(mp);
                setPhoneList([]);
            }
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
        const api = new APIHandler();
        const result = await api.getData(API_CALLS.phone, {member_id: mId});
        var rs = await result.json();

        var mp = new Map<string, MemberPhoneInfo>();
        if (rs.length > 0) {
            for(var i=0; i<rs.length; i++) {
                const pInfo = new MemberPhoneInfo(rs[i]);
                mp.set(pInfo.phone_id, pInfo);
            }
        }
        setPhoneMap(mp);
        setPhoneList(Array.from(mp.values()));
    }

    useEffect(() => {
        updateMemberInfo();
    }, [props.memberId, props.isAdmin]);
    
    useEffect(() => {
        updateIsEditing();
    }, [props.isEditing, props.isCreating]);

    useEffect(() => {
        onSave();
    }, [props.needsSave]);      

    return (
        <>
            {phoneList.map((pInfo, index) => (
                <Grid2 key={pInfo.phone_id + "_grid"} size={{xs: 12, sm: 6}}>
                    <Box key={pInfo.phone_id}>
                        <Typography style={{display:isEditing ? 'none' : 'block'}}>{pInfo.pNumber}</Typography>
                        <TextField style={{display:isEditing ? 'block' : 'none'}} label="Phone Number" defaultValue={pInfo.pNumber} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updatePhoneNumber(pInfo.phone_id, event.target.value); }} />
                        <Checkbox color='secondary' style={{display:isEditing ? 'block' : 'none'}} defaultChecked={pInfo.isPrimary === 'true'} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateIsPrimary(pInfo.phone_id, event.target.checked); }} />
                    </Box>
                </Grid2>
            ))}
            <Grid2 size={{xs: 12, sm: 6}}>
                <Button color='secondary' variant="contained" onClick={onAddPhone} style={{display:isEditing ? 'block' : 'none'}}>Add Phone</Button>
            </Grid2>
        </>
    );
}