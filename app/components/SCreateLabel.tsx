"use client"

import { useEffect, useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import { SCreateLabelProp } from "../props/SCreateLabelProp";
import LabelInfo from '../lib/LabelInfo';
import { v4 } from 'uuid';

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

        const url = `/api/labels/member?label_id=${lblId}&labelName=${lName}&labelDescription=${lDescription}&church_id=${cId}&forSchedule=${fSchedule}&owner_id=${oId}`;
        const result = await fetch(url, { method:"POST"});
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
    }, [props.parentLabel, props.createrId, props.churchId]);    

    return (
        <>
            Parent is {parentLabel?.labelName}
            <TextField required label="Label Name" onChange={labelNameChange} />
            <TextField label="Label Information" onChange={labelInfoChange} />
            <FormControlLabel control={<Checkbox checked={forSchedule} onChange={checkForSchedule} />} label="For Schedule" />            
            <Button endIcon={<CreateIcon />} onClick={createLabel}>
                Create Label
            </Button>
        </>
    );
}