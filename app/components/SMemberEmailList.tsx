import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { Box, Typography, Button, TextField, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { MemberEmailInfo } from "../lib/MemberEmailInfo";
import { UpdateType } from "../lib/UpdateType";
import { v4 } from 'uuid';

export default function SMemberEmailList(props:SMemberInfoProp) {
    let [emailList, setEmailList] = useState<MemberEmailInfo[]>([]);
    let [emailMap, setEmailMap] = useState<Map<string, MemberEmailInfo>>(new Map<string, MemberEmailInfo>());
    let [isEditing, setIsEditing] = useState<boolean>(props.isEditing ? true : false);

    const onAddEmail = () => {
        const eInfo = new MemberEmailInfo({});
        eInfo.email_id = v4();
        eInfo.updateType = UpdateType.create;

        // Add to the map
        const mp = emailMap;
        mp.set(eInfo.email_id, eInfo);

        sendChanges(mp);
    }

    const updateEmail = (eId:string, email:string) =>{
        // Get the email info
        const eInfo = emailMap.get(eId);

        if (eInfo) {
            eInfo.email = email;

            const eMap = emailMap;
            if (eInfo.updateType === UpdateType.none) {
                eInfo.updateType = UpdateType.update;
            }
            eMap.set(eId, eInfo);

            // Update is needed!
            sendChanges(eMap);
        }
    }   
    
    const updateIsPrimary = (eId:string, isPrimary:boolean) => {
        // Get the email info
        const eInfo = emailMap.get(eId);

        if (eInfo) {
            eInfo.isPrimary = isPrimary ? 'true' : 'false';

            const eMap = emailMap;
            if (eInfo.updateType === UpdateType.none) {
                eInfo.updateType = UpdateType.update;
            }
            eMap.set(eId, eInfo);

            // Update is needed!
            sendChanges(eMap);
        }
    }

    const sendChanges = (eMap:Map<string, MemberEmailInfo>) => {
        const eList:MemberEmailInfo[] = [];

        // Update the list based on the map
        eMap.forEach((value, key) => {
            eList.push(value);
        });

        // Set the Map
        setEmailMap(eMap);

        // Set the list
        setEmailList(eList);

        // Inform parent of the change
        if (props.onUpdateEmailList) {
            props.onUpdateEmailList(eList);
        }
    }

    const resetState = () => {
        // Reset isEditing
        const isEdit = props.isEditing ? true : false;
        setIsEditing(isEdit);

        // Reset the phone list
        var eList:MemberEmailInfo[] = [];
        if (props.emailList) {
            eList = props.emailList;
        }

        // Create a map of the phone list
        var eMap = new Map<string, MemberEmailInfo>();
        for(var i=0; i<eList.length; i++) {
            eMap.set(eList[i].email_id, eList[i]);
        }

        setEmailList(eList);
        setEmailMap(eMap);
    }    

    useEffect(() => {
        resetState();        
    }, [props.emailList, props.isEditing]);       

    return (
        <>
            {emailList.map((eInfo, index) => (                
                <Box key={eInfo.email_id}>
                    <Typography style={{display:isEditing ? 'none' : 'block'}}>{eInfo.email}</Typography>
                    <TextField style={{display:isEditing ? 'block' : 'none'}} label="Email" defaultValue={eInfo.email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateEmail(eInfo.email_id || '', event.target.value); }} />
                    <Checkbox style={{display:isEditing ? 'block' : 'none'}} defaultChecked={eInfo.isPrimary === 'true'} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateIsPrimary(eInfo.email_id || '', event.target.checked); }} />
                </Box>
            ))}
            <Button color="secondary" variant="contained" onClick={onAddEmail} style={{display:isEditing ? 'block' : 'none'}}>Add Email</Button>            
        </>
    );

}