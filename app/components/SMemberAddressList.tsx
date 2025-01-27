import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { Box, Typography, TextField, Button, Grid2 } from "@mui/material";
import { useEffect, useState } from "react";
import { MemberAddressInfo } from "../lib/MemberAddressInfo";
import { UpdateType } from "../lib/UpdateType";
import { v4 } from 'uuid';
import { API_CALLS, APIHandler } from "../lib/APIHanlder";

export default function SMemberAddressList(props:SMemberInfoProp) {
    let [memberId, setMemberId] = useState<string>('');
    let [addressMap, setAddressMap] = useState<Map<string, MemberAddressInfo>>(new Map<string, MemberAddressInfo>());
    let [addressList, setAddressList] = useState<MemberAddressInfo[]>([]);
    let [isDirty, setIsDirty] = useState<boolean>(false);
    let [isEditing, setIsEditing] = useState<boolean>(props.isEditing ? true : false);
    let [isCreating, setIsCreating] = useState<boolean>(props.isCreating ? true : false);
    let [updateMap, setUpdateMap] = useState<Map<string, UpdateType>>(new Map<string, UpdateType>());

    const onAddAddress = () => {
        const aInfo = new MemberAddressInfo({});
        aInfo.address_id = v4();
        aInfo.member_id = memberId;

        // Add to the list
        const mp = addressMap;
        mp.set(aInfo.address_id, aInfo);       

        // Track the operation
        if (updateMap.has(aInfo.address_id) === false) {
            updateMap.set(aInfo.address_id, UpdateType.create);
        }

        setAddressMap(mp);
        setAddressList(Array.from(mp.values()));
        setIsDirty(true);
    }

    const updateAddress1 = (aId:string, address:string) =>{
        // Get the Address info
        const aInfo = addressMap.get(aId);

        if (aInfo) {
            aInfo.address1 = address;

            // Track the operation
            if (!updateMap.has(aId)) {
                updateMap.set(aId, UpdateType.update);
            }

            // Update is needed!
            setIsDirty(true);
        }
    }

    const updateAddress2 = (aId:string, address:string) =>{
        // Get the Address info
        const aInfo = addressMap.get(aId);

        if (aInfo) {
            aInfo.address2 = address;

            // Track the operation
            if (!updateMap.has(aId)) {
                updateMap.set(aId, UpdateType.update);
            }

            // Update is needed!
            setIsDirty(true);
        }
    }    

    const updateCity = (aId:string, city:string) =>{
        // Get the Address info
        const aInfo = addressMap.get(aId);

        if (aInfo) {
            aInfo.city = city;

            // Track the operation
            if (!updateMap.has(aId)) {
                updateMap.set(aId, UpdateType.update);
            }

            // Update is needed!
            setIsDirty(true);
        }
    }    

    const updateState = (aId:string, state:string) =>{
        // Get the Address info
        const aInfo = addressMap.get(aId);

        if (aInfo) {
            aInfo.state = state;

            // Track the operation
            if (!updateMap.has(aId)) {
                updateMap.set(aId, UpdateType.update);
            }

            // Update is needed!
            setIsDirty(true);
        }
    }   
    
    const updateZipcode = (aId:string, zip:string) =>{
        // Get the Address info
        const aInfo = addressMap.get(aId);

        if (aInfo) {
            aInfo.zip = zip;

            // Track the operation
            if (!updateMap.has(aId)) {
                updateMap.set(aId, UpdateType.update);
            }

            // Update is needed!
            setIsDirty(true);
        }
    }      
    

    const saveElement = async(addressId:string, updateType:UpdateType) => {
        // Get the phone info
        const aInfo = addressMap.get(addressId);
        
        // If it is not found, then we can't do anything
        if (aInfo === undefined) {
            return;
        }

        const api = new APIHandler();

        switch (updateType) {
            case UpdateType.create:                
                await api.createData(API_CALLS.address, aInfo);
                break;
            case UpdateType.update:
                await api.postData(API_CALLS.address, aInfo);
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
                const mp = addressMap;
                mp.clear();
                setAddressMap(mp);
                setAddressList([]);
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
        const result = await api.getData(API_CALLS.address, { member_id: mId });
        var rs = await result.json();

        var mp = new Map<string, MemberAddressInfo>();
        if (rs.length > 0) {
            for(var i=0; i<rs.length; i++) {
                const aInfo = new MemberAddressInfo(rs[i]);
                mp.set(aInfo.address_id, aInfo);
            }
        }
        setAddressMap(mp);
        setAddressList(Array.from(mp.values()));                
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
            {addressList.map((aInfo, index) => (
                <Grid2 key={aInfo.address_id + "_grid"} size={{xs: 12, sm: 6}}>
                    <Box key={aInfo.address_id}>
                        <Typography style={{display:isEditing ? 'none' : 'block'}}>
                            {aInfo.address1} <br />
                            {aInfo.address2} <br />
                            {aInfo.city}, {aInfo.state} {aInfo.zip}
                        </Typography>
                        <TextField style={{display:isEditing ? 'block' : 'none'}} label="Address 1" defaultValue={aInfo.address1} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateAddress1(aInfo.address_id, event.target.value); }} />                    
                        <TextField style={{display:isEditing ? 'block' : 'none'}} label="Address 2" defaultValue={aInfo.address1} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateAddress2(aInfo.address_id, event.target.value); }} />                        
                        <TextField style={{display:isEditing ? 'block' : 'none'}} label="City" defaultValue={aInfo.address1} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateCity(aInfo.address_id, event.target.value); }} />                        
                        <TextField style={{display:isEditing ? 'block' : 'none'}} label="State" defaultValue={aInfo.address1} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateState(aInfo.address_id, event.target.value); }} />                        
                        <TextField style={{display:isEditing ? 'block' : 'none'}} label="Zip" defaultValue={aInfo.address1} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateZipcode(aInfo.address_id, event.target.value); }} />                        
                    </Box>
                </Grid2>
            ))}
            <Grid2 size={{xs: 12, sm: 6}}>
                <Button color="secondary" variant="contained" onClick={onAddAddress} style={{display:isEditing ? 'block' : 'none'}}>Add Address</Button>
            </Grid2>                
        </>
    );

}