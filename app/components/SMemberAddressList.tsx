import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { Box, Typography, TextField, Button, Grid2 } from "@mui/material";
import { useEffect, useState } from "react";
import { MemberAddressInfo } from "../lib/MemberAddressInfo";
import { UpdateType } from "../lib/UpdateType";
import { v4 } from 'uuid';

export default function SMemberAddressList(props:SMemberInfoProp) {
    let [addressList, setAddressList] = useState<MemberAddressInfo[]>([]);
    let [addressMap, setAddressMap] = useState<Map<string, MemberAddressInfo>>(new Map<string, MemberAddressInfo>());
    let [isEditing, setIsEditing] = useState<boolean>(props.isEditing ? true : false);

    const onAddAddress = () => {
        const aInfo = new MemberAddressInfo({});
        aInfo.address_id = v4();
        aInfo.updateType = UpdateType.create;

        // Add to the map
        const mp = addressMap;
        mp.set(aInfo.address_id, aInfo);

        sendChanges(mp);
    }

    const sendChanges = (aMap:Map<string, MemberAddressInfo>) => {
        const aList:MemberAddressInfo[] = [];

        // Update the list based on the map
        aMap.forEach((value, key) => {
            aList.push(value);
        });

        // Set the Map
        setAddressMap(aMap);

        // Set the list
        setAddressList(aList);

        // Inform parent of the change
        if (props.onUpdateAddressList) {
            props.onUpdateAddressList(aList);
        }
    }    

    const updateAddress1 = (aId:string, address:string) =>{
        // Get the Address info
        const aInfo = addressMap.get(aId);

        if (aInfo) {
            aInfo.address1 = address;

            const aMap = addressMap;
            if (aInfo.updateType === UpdateType.none) {
                aInfo.updateType = UpdateType.update;
            }
            aMap.set(aId, aInfo);

            sendChanges(aMap);
        }      
    }

    const updateAddress2 = (aId:string, address:string) =>{
        // Get the Address info
        const aInfo = addressMap.get(aId);

        if (aInfo) {
            aInfo.address2 = address;

            const aMap = addressMap;
            if (aInfo.updateType === UpdateType.none) {
                aInfo.updateType = UpdateType.update;
            }
            aMap.set(aId, aInfo);

            sendChanges(aMap);
        }    
    }    

    const updateCity = (aId:string, city:string) =>{
        const aInfo = addressMap.get(aId);

        if (aInfo) {
            aInfo.city = city;

            const aMap = addressMap;
            if (aInfo.updateType === UpdateType.none) {
                aInfo.updateType = UpdateType.update;
            }
            aMap.set(aId, aInfo);

            sendChanges(aMap);
        }
    }    

    const updateState = (aId:string, state:string) =>{
        const aInfo = addressMap.get(aId);

        if (aInfo) {
            aInfo.state = state;

            const aMap = addressMap;
            if (aInfo.updateType === UpdateType.none) {
                aInfo.updateType = UpdateType.update;
            }
            aMap.set(aId, aInfo);

            sendChanges(aMap);
        }
    }   
    
    const updateZipcode = (aId:string, zip:string) =>{
        const aInfo = addressMap.get(aId);

        if (aInfo) {
            aInfo.zip = zip;

            const aMap = addressMap;
            if (aInfo.updateType === UpdateType.none) {
                aInfo.updateType = UpdateType.update;
            }
            aMap.set(aId, aInfo);

            sendChanges(aMap);
        }
    }

    const resetState = () => {
        // Reset isEditing
        setIsEditing(props.isEditing ? true : false);

        // Reset the phone list
        var aList:MemberAddressInfo[] = [];
        if (props.addressList) {
            aList = props.addressList;
        }

        // Create a map of the phone list
        var aMap = new Map<string, MemberAddressInfo>();
        for(var i=0; i<aList.length; i++) {
            aMap.set(aList[i].address_id, aList[i]);
        }

        setAddressList(aList);
        setAddressMap(aMap);
    }      

    useEffect(() => {
        resetState();        
    }, [props.addressList, props.isEditing]); 

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
                        <TextField style={{display:isEditing ? 'block' : 'none'}} label="Address 2" defaultValue={aInfo.address2} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateAddress2(aInfo.address_id, event.target.value); }} />                        
                        <TextField style={{display:isEditing ? 'block' : 'none'}} label="City" defaultValue={aInfo.city} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateCity(aInfo.address_id, event.target.value); }} />                        
                        <TextField style={{display:isEditing ? 'block' : 'none'}} label="State" defaultValue={aInfo.state} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateState(aInfo.address_id, event.target.value); }} />                        
                        <TextField style={{display:isEditing ? 'block' : 'none'}} label="Zip" defaultValue={aInfo.zip} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { updateZipcode(aInfo.address_id, event.target.value); }} />                        
                    </Box>
                </Grid2>
            ))}
            <Grid2 size={{xs: 12, sm: 6}}>
                <Button color="secondary" variant="contained" onClick={onAddAddress} style={{display:isEditing ? 'block' : 'none'}}>Add Address</Button>
            </Grid2>                
        </>
    );

}