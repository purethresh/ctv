"use client"

import { useEffect, useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import { SCreateLabelProp } from "../props/SCreateLabelProp";
import { LabelInfo } from '../lib/LabelInfo';
import { v4 } from 'uuid';
import { API_CALLS, APIHandler } from '../lib/APIHanlder';

export default function SCreateLabel(props: SCreateLabelProp) {
    let [parentLabel, setParentLabel] = useState<LabelInfo | undefined>(props.parentLabel);
    let [labelName, setLabelName] = useState<string>('');
    let [labelDescription, setLabelDescription] = useState<string>('');
    let [churchId, setChurchId] = useState<string>('');
    let [forSchedule, setForSchedule] = useState<boolean>(false);

    const labelNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLabelName(event.target.value);
    }

    const labelInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLabelDescription(event.target.value);
    }

    const checkForSchedule = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForSchedule(event.target.checked);
    }

    const createLabel = async () => {
        // If no label name, then return
        if (labelName.length <= 0) {
            return;
        }

        // If no church id, then return
        if (churchId.length <= 0) {
            return;
        }

        // Now create the label
        const lblId = encodeURIComponent(v4());
        const lName = encodeURIComponent(labelName);
        const lDescription = encodeURIComponent(labelDescription);
        const cId = encodeURIComponent(churchId);
        const fSchedule = encodeURIComponent(forSchedule ? 'true' : 'false');
        const oId = encodeURIComponent(parentLabel?.label_id || '');

        const api = new APIHandler();
        const result = await api.postData(API_CALLS.labels, { label_id: lblId, labelName: lName, labelDescription: lDescription, church_id: cId, forSchedule: fSchedule, owner_id: oId });
        var rs = await result.json();
        
        if (props.onReload) {
            props.onReload();
        }

        // Clear the form
        setLabelName('');
        setLabelDescription('');
        setForSchedule(false);
    }

    useEffect(() => {
        const updateParentLabel = async () => {
            setParentLabel(props.parentLabel);
            setChurchId(props.churchId || '');
        }
        
        updateParentLabel();
    }, [props.parentLabel, props.userId, props.churchId]);    

    return (
        <Box>
            <Box bgcolor='secondary.main' sx={{ paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px'}}>
                <Typography variant="h6" color='secondary.contrastText'>Create a child label for {parentLabel?.labelName}</Typography>
            </Box>
            <Box>
                <TextField required label="Label Name" onChange={labelNameChange} sx={{ paddingLeft: '10px', paddingRight:'5px', paddingTop:'8px'}}/>
                <TextField label="Label Information" onChange={labelInfoChange} sx={{ paddingLeft: '5px', paddingRight:'5px', paddingTop:'8px'}}/>
                <FormControlLabel control={<Checkbox checked={forSchedule} onChange={checkForSchedule} />} label="For Schedule" sx={{marginTop: '14px'}}/>            
                <Button variant='contained' color='secondary' endIcon={<CreateIcon />} onClick={createLabel} sx={{ marginTop:'16px'}}>Create Label</Button>
            </Box>
        </Box>
    );
}