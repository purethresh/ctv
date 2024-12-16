import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { Box, Typography, Button, TextField, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { MemberPhoneInfo } from "../lib/MemberPhoneInfo";
import { v4 } from 'uuid';
import { UpdateType } from "../lib/UpdateType";

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

        const req:RequestInit = {
            method: '',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pInfo)
        }

        switch (updateType) {
            case UpdateType.create:
                req.method = 'PUT';
                break;
            case UpdateType.update:
                req.method = 'POST';
                break;
            default:
                // Nothing else is currently implemented
        }

        if (req.method !== undefined && req.method.length > 0) {
            await fetch('/api/member/phone', req);
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

            // Get the member info (without cache)
            const result = await fetch(`/api/member/phone?member_id=${memberId}`);

            // Now clear the dirty flag
            setIsDirty(false);

            // Inform that save is done
            if (props.onSaveComplete) {
                props.onSaveComplete();
            }
        }        
    }

    const updateIsEditing = () => {
        console.log('TODO JLS - - - - - - start of updateIsEditing');
        const editing = props.isEditing ? true : false;
        const creating = props.isCreating ? true : false;
        setIsCreating(creating);

        if (editing !== isEditing) {
            setIsEditing(editing);            

            if (creating) {
                // TODO JLS, there is an item in the phone map when starting
                // WHY?  It should be empty
                // Maybe the member id is wrong?
                //
                // updateMap.set(v4(), UpdateType.create);
                console.log('Adding a phone');
                console.log(phoneMap);
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
        const result = await fetch(`/api/member/phone?member_id=${mId}`, { cache: 'force-cache' });
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
                <Box key={pInfo.phone_id}>
                    <Typography style={{display:isEditing ? 'none' : 'block'}}>{pInfo.pNumber}</Typography>
                    <TextField style={{display:isEditing ? 'block' : 'none'}} label="Phone Number" defaultValue={pInfo.pNumber} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updatePhoneNumber(pInfo.phone_id, event.target.value); }} />
                    <Checkbox style={{display:isEditing ? 'block' : 'none'}} defaultChecked={pInfo.isPrimary === 'true'} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateIsPrimary(pInfo.phone_id, event.target.checked); }} />
                </Box>
            ))}         
            <Button onClick={onAddPhone} style={{display:isEditing ? 'block' : 'none'}}>Add Phone</Button>
        </>
    );
}