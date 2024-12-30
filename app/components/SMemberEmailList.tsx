import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { Box, Typography, Button, TextField, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { MemberEmailInfo } from "../lib/MemberEmailInfo";
import { UpdateType } from "../lib/UpdateType";
import { v4 } from 'uuid';
import { API_CALLS, APIHandler } from "../lib/APIHanlder";

export default function SMemberEmailList(props:SMemberInfoProp) {
    let [memberId, setMemberId] = useState<string>('');
    let [emailMap, setEmailMap] = useState<Map<string, MemberEmailInfo>>(new Map<string, MemberEmailInfo>());
    let [emailList, setEmailList] = useState<MemberEmailInfo[]>([]);
    let [isDirty, setIsDirty] = useState<boolean>(false);
    let [isEditing, setIsEditing] = useState<boolean>(props.isEditing ? true : false);
    let [isCreating, setIsCreating] = useState<boolean>(props.isCreating ? true : false);
    let [updateMap, setUpdateMap] = useState<Map<string, UpdateType>>(new Map<string, UpdateType>());

    const onAddEmail = () => {
        const eInfo = new MemberEmailInfo({});
        eInfo.email_id = v4();
        eInfo.member_id = memberId;

        // Add to the list
        const mp = emailMap;
        mp.set(eInfo.email_id, eInfo);       

        // Track the operation
        if (updateMap.has(eInfo.email_id) === false) {
            updateMap.set(eInfo.email_id, UpdateType.create);
        }

        setEmailMap(mp);
        setEmailList(Array.from(mp.values()));
        setIsDirty(true);
    }

    const updateEmail = (eId:string, email:string) =>{
        // Get the email info
        const eInfo = emailMap.get(eId);

        if (eInfo) {
            eInfo.email = email;

            // Track the operation
            if (!updateMap.has(eId)) {
                updateMap.set(eId, UpdateType.update);
            }

            // Update is needed!
            setIsDirty(true);
        }
    }   
    
    const updateIsPrimary = (eId:string, isPrimary:boolean) => {
        // Get the email info
        const eInfo = emailMap.get(eId);

        if (eInfo) {
            eInfo.isPrimary = isPrimary ? 'true' : 'false';

            // Track the operation
            if (!updateMap.has(eId)) {
                updateMap.set(eId, UpdateType.update);
            }

            // Update is needed!
            setIsDirty(true);
        }
    }    

    const saveElement = async(emailId:string, updateType:UpdateType) => {
        // Get the phone info
        const eInfo = emailMap.get(emailId);
        
        // If it is not found, then we can't do anything
        if (eInfo === undefined) {
            return;
        }

        const api = new APIHandler();
        switch (updateType) {
            case UpdateType.create:
                await api.createData(API_CALLS.email, eInfo);
                break;
            case UpdateType.update:
                await api.postData(API_CALLS.email, eInfo);
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

            // Get the member info (without cache)
            const api = new APIHandler();
            const result = await api.getData(API_CALLS.email, { member_id: memberId }, false);

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
                const mp = emailMap;
                mp.clear();
                setEmailMap(mp);
                setEmailList([]);
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
        const result = await api.getData(API_CALLS.email, { member_id: mId }, true);
        var rs = await result.json();

        var mp = new Map<string, MemberEmailInfo>();
        if (rs.length > 0) {
            for(var i=0; i<rs.length; i++) {
                const eInfo = new MemberEmailInfo(rs[i]);
                mp.set(eInfo.email_id, eInfo);
            }
        }
        setEmailMap(mp);
        setEmailList(Array.from(mp.values()));            
    }

    useEffect(() => {
        updateIsEditing();
    }, [props.isEditing, props.isCreating]);

    useEffect(() => {
        onSave();
    }, [props.needsSave]);     

    useEffect(() => {
        updateMemberInfo();
    }, [props.memberId, props.isAdmin]); 

    return (
        <>
            {emailList.map((eInfo, index) => (                
                <Box key={eInfo.email_id}>
                    <Typography style={{display:isEditing ? 'none' : 'block'}}>{eInfo.email}</Typography>
                    <TextField style={{display:isEditing ? 'block' : 'none'}} label="Email" defaultValue={eInfo.email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateEmail(eInfo.email_id || '', event.target.value); }} />
                    <Checkbox style={{display:isEditing ? 'block' : 'none'}} defaultChecked={eInfo.isPrimary === 'true'} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateIsPrimary(eInfo.email_id || '', event.target.checked); }} />
                </Box>
            ))}
            <Button onClick={onAddEmail} style={{display:isEditing ? 'block' : 'none'}}>Add Email</Button>            
        </>
    );

}