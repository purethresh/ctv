"use client"

import { useEffect, useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import { SLabelDataProp } from "../props/SLabelDataProp";
import { LabelInfo } from '../lib/LabelInfo';

export default function SLabelData(props: SLabelDataProp) {

    let [labelInfo, setLabelInfo] = useState<LabelInfo | undefined>(props.label);
    let [parentLabelInfo, setParentLabelInfo] = useState<LabelInfo | undefined>(props.label);
    let [isCreate, setIsCreate] = useState<boolean>(props.isCreate);
    let [currentInfo, setCurrentInfo] = useState<LabelInfo>(new LabelInfo({}));

    const saveLabelChanges = async () => {
        if (props.updateLabel) {
            props.updateLabel(currentInfo);
        }
    }

    const updateLabelName = (name:string) => {
        currentInfo.labelName = name;
        setCurrentInfo(currentInfo);
    }

    const updateLabelInfo = (info:string) => {
        currentInfo.labelDescription = info;
        setCurrentInfo(currentInfo);
    }

    const updateForSchedule = (schedule:boolean) => {
        currentInfo.forSchedule = schedule;
        setCurrentInfo(currentInfo);
    }

    const updateScheduleGroup = (group:boolean) => {
        currentInfo.scheduleGroup = group;
        setCurrentInfo(currentInfo);
    }

    useEffect(() => {
        const updateLabelInfo = async () => {
            setLabelInfo(props.label);
            setParentLabelInfo(props.parent);
            var lInfo = props.label?.clone() || new LabelInfo({});            

            if (!props.isCreate) {                
                setCurrentInfo(lInfo);
            }
        }
        
        updateLabelInfo();
    }, [props.label, props.parent]);        
    
    return (
        <Box>
            <Box bgcolor='secondary.main' sx={{ paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px'}}>
                {isCreate && <Typography variant="h6" color='secondary.contrastText'>Create a child label for {parentLabelInfo?.labelName || ''}</Typography> }
                {!isCreate && <Typography variant="h6" color='secondary.contrastText'>Edit {labelInfo?.labelName || ''}</Typography> }
            </Box>

            <Box>
                <TextField required label="Label Name" defaultValue={currentInfo.labelName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {updateLabelName(event.target.value)}} sx={{ paddingLeft: '10px', paddingRight:'5px', paddingTop:'8px'}}/>
                <TextField required label="Label Information" defaultValue={currentInfo.labelDescription} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {updateLabelInfo(event.target.value)}} sx={{ paddingLeft: '10px', paddingRight:'5px', paddingTop:'8px'}}/>
                <FormControlLabel control={
                    <Checkbox checked={currentInfo.forSchedule} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {updateForSchedule(event.target.checked)}} />
                    } label="For Schedule" sx={{marginTop: '14px'}}/>
                <FormControlLabel control={
                    <Checkbox checked={currentInfo.scheduleGroup} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {updateScheduleGroup(event.target.checked)}} />
                    } label="Schedule Group" sx={{marginTop: '14px'}}/>
                {isCreate && <Button variant='contained' color='secondary' endIcon={<AddBoxIcon />} onClick={saveLabelChanges} sx={{ marginTop:'16px'}}>Create Label</Button>}
                {!isCreate && <Button variant='contained' color='secondary' endIcon={<EditIcon />} onClick={saveLabelChanges} sx={{ marginTop:'16px'}}>Edit Label</Button>}
            </Box>
        </Box>
    );   
}