import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { Box, Typography, Button, TextField, Checkbox, Grid2 } from "@mui/material";
import { useEffect, useState } from "react";
import { MemberPhoneInfo } from "../lib/MemberPhoneInfo";
import { v4 } from 'uuid';
import { UpdateType } from "../lib/UpdateType";

export default function SMemberPhoneList(props:SMemberInfoProp) {
    let [phoneList, setPhoneList] = useState<MemberPhoneInfo[]>([]);
    let [phoneMap, setPhoneMap] = useState<Map<string, MemberPhoneInfo>>(new Map<string, MemberPhoneInfo>());
    let [isEditing, setIsEditing] = useState<boolean>(props.isEditing ? true : false);

    const onAddPhone = () => {
        const pInfo = new MemberPhoneInfo({});
        pInfo.phone_id = v4();
        pInfo.updateType = UpdateType.create;

        // Add to the map
        const mp = phoneMap;
        mp.set(pInfo.phone_id, pInfo);

        sendChanges(mp);
    }

    const updatePhoneNumber = (pId:string, pNumber:string) =>{
        // Get the phone info
        const pInfo = phoneMap.get(pId);

        if (pInfo) {
            pInfo.pNumber = pNumber;

            const pMap = phoneMap;
            if (pInfo.updateType === UpdateType.none) {
                pInfo.updateType = UpdateType.update;                
            }
            pMap.set(pId, pInfo);

            sendChanges(pMap);
        }
    }

    const updateIsPrimary = (pId:string, isPrimary:boolean) => {
        // Get the phone info
        const pInfo = phoneMap.get(pId);

        if (pInfo) {
            pInfo.isPrimary = isPrimary ? 'true' : 'false';

            const pMap = phoneMap;
            if (pInfo.updateType === UpdateType.none) {
                pInfo.updateType = UpdateType.update;                
            }
            pMap.set(pId, pInfo);

            sendChanges(pMap);
        }
    }

    const sendChanges = (pMap:Map<string, MemberPhoneInfo>) => {
        const pList:MemberPhoneInfo[] = [];

        // Update the list based on the map
        pMap.forEach((value, key) => {
            pList.push(value);
        });

        // Set the Map
        setPhoneMap(pMap);

        // Set the list
        setPhoneList(pList);

        // Inform parent of the change
        if (props.onUpdatePhoneList) {
            props.onUpdatePhoneList(pList);
        }
    }

    const resetState = () => {
        // Reset isEditing
        setIsEditing(props.isEditing ? true : false);

        // Reset the phone list
        var pList:MemberPhoneInfo[] = [];
        if (props.phoneList) {
            pList = props.phoneList;
        }

        // Create a map of the phone list
        var pMap = new Map<string, MemberPhoneInfo>();
        for(var i=0; i<pList.length; i++) {
            pMap.set(pList[i].phone_id, pList[i]);
        }

        setPhoneList(pList);        
        setPhoneMap(pMap);
    }


    useEffect(() => {
        resetState();        
    }, [props.phoneList, props.isEditing]);         

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