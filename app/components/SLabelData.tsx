"use client"

import { useEffect, useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import { SLabelDataProp } from "../props/SLabelDataProp";
import { LabelInfo } from '../lib/LabelInfo';
import { UpdateType } from '../lib/UpdateType';
import { v4 } from 'uuid';

export default function SLabelData(props: SLabelDataProp) {

    let [labelInfo, setLabelInfo] = useState<LabelInfo>(props.label || new LabelInfo({}));
    let [parentLabelInfo, setParentLabelInfo] = useState<LabelInfo>(props.label || new LabelInfo({}));
    let [isCreate, setIsCreate] = useState<boolean>(props.isCreate);

    let [lblName, setLblName] = useState<string>('');
    let [lblInfo, setLblInfo] = useState<string>('');
    let [forSchedule, setForSchedule] = useState<boolean>(false);
    let [scheduleGroup, setScheduleGroup] = useState<boolean>(false);

    const saveLabelChanges = async () => {
        if (props.updateLabel) {
            const lbl = labelInfo;

            if (isCreate) {
                lbl.label_id = v4();
                lbl.owner_id = parentLabelInfo.label_id;
                lbl.updateType = UpdateType.create
            } else {
                lbl.updateType = UpdateType.update;
            }
            props.updateLabel(lbl);
        }
    }

    const updateLabelName = (name:string) => {
        const lbl = labelInfo;
        lbl.labelName = name;
        setLabelInfo(lbl);
        setLblName(name);
    }

    const updateLabelInfo = (info:string) => {
        const lbl = labelInfo;
        lbl.labelDescription = info;
        setLabelInfo(lbl);
        setLblInfo(info);
    }

    const updateForSchedule = (schedule:boolean) => {
        const lbl = labelInfo;
        lbl.forSchedule = schedule;
        setLabelInfo(lbl);
        setForSchedule(schedule);
    }

    const updateScheduleGroup = (group:boolean) => {
        const lbl = labelInfo;
        lbl.scheduleGroup = group;
        setLabelInfo(lbl);
        setScheduleGroup(group);
    }

    useEffect(() => {
        const resetState = async () => {
            setIsCreate(props.isCreate);

            const lbl = props.label || new LabelInfo({});
            const parent = props.parent || new LabelInfo({});

            setLblName(lbl.labelName);
            setLblInfo(lbl.labelDescription);
            setForSchedule(lbl.forSchedule);
            setScheduleGroup(lbl.scheduleGroup);

            setLabelInfo(lbl);
            setParentLabelInfo(parent);
        }
        
        resetState();
    }, [props.label, props.parent]);        
    
    return (
        <Box>
            <Box bgcolor='secondary.main' sx={{ paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px'}}>
                {isCreate && <Typography variant="h6" color='secondary.contrastText'>Create a child label for {parentLabelInfo?.labelName || ''}</Typography> }
                {!isCreate && <Typography variant="h6" color='secondary.contrastText'>Edit {lblName || ''}</Typography> }
            </Box>

            <Box>
                <TextField required label="Label Name" value={lblName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {updateLabelName(event.target.value)}} sx={{ paddingLeft: '10px', paddingRight:'5px', paddingTop:'8px'}}/>
                <TextField required label="Label Information" value={lblInfo} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {updateLabelInfo(event.target.value)}} sx={{ paddingLeft: '10px', paddingRight:'5px', paddingTop:'8px'}}/>
                <FormControlLabel control={
                    <Checkbox checked={forSchedule} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {updateForSchedule(event.target.checked)}} />
                    } label="For Schedule" sx={{marginTop: '14px'}}/>
                <FormControlLabel control={
                    <Checkbox checked={scheduleGroup} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {updateScheduleGroup(event.target.checked)}} />
                    } label="Schedule Group" sx={{marginTop: '14px'}}/>
                {isCreate && <Button variant='contained' color='secondary' endIcon={<AddBoxIcon />} onClick={saveLabelChanges} sx={{ marginTop:'16px'}}>Create Label</Button>}
                {!isCreate && <Button variant='contained' color='secondary' endIcon={<EditIcon />} onClick={saveLabelChanges} sx={{ marginTop:'16px'}}>Save Label</Button>}
            </Box>
        </Box>
    );   
}