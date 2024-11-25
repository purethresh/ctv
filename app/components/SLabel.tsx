import { SLabelProps } from "../props/SLabelProps";
import { Box, Chip, IconButton } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRigthIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useState, useEffect } from "react";

// TODO JLS
// Make it so clicking on label goes to the label page. (But only if admin)
// Show label info when expanded
// Make it so you can remove user from scheduled label
// Make it so you can add user to scheduled label
// Make it so icon is only shown if admin, and has schedule info

export default function SLabel(props:SLabelProps) {
    let [isCompact, setIsCompact] = useState<boolean>(props.compact || false);
    let [isAdmin, setIsAdmin] = useState<boolean>(props.admin || false);
    let [controlIsClosed, setControlIsClosed] = useState<boolean>(true);
    let [scheduledList, setScheduledList] = useState<object[]>([]);
    let [memberList, setMemberList] = useState<object[]>([]);

    const removeUserFromScheduled = (memberInfo:any) => {
        console.log(memberInfo);
        // It has a schedule_id so remove that item
        // TODO JLS handle for differnt chips
    }

    const addUserToSchedule = (memberInfo:any) => {
        console.log(memberInfo);
        // TODO JLS handle for differnt chips
    }

    const toggleControlOpen = async () => {
        const isClosed = !controlIsClosed;
        setControlIsClosed(isClosed);

        // Load list of memmbers
        if (!isClosed && props.labelInfo != undefined) {
            const res = await fetch(`/api/member?label_id=${props.labelInfo.label_id}`, { cache: 'force-cache' });
            const data = await res.json();
            setMemberList(data);
        }
        else {
            setMemberList([]);
        }

    }

    useEffect(() => {
        const updateShowElements = async () => {
            var scheduledMembers = [];
            if (props.labelInfo?.scheduled != undefined) {
                scheduledMembers = props.labelInfo.scheduled;
            }
            setScheduledList(scheduledMembers);
        }
        
        updateShowElements();

    }, [props.labelInfo]);

    return (
        <>
        <Box component="section"
            style={{
                display:isCompact ? 'none' : 'inline-flex',
                borderRadius:3
            }}
            sx={{bgcolor:'primary.main'}}>
            {props.labelInfo?.labelName}
            <IconButton onClick={toggleControlOpen} style={{display:isAdmin ? 'block' : 'none'}}>
                <ChevronRigthIcon style={{display:controlIsClosed ? 'block' : 'none'}} />
                <ExpandMoreIcon style={{display:controlIsClosed ? 'none' : 'block'}} />
            </IconButton>            
        </Box>
        <Chip style={{display:isCompact ? 'inline-flex' : 'none'}}
            label={props.labelInfo?.labelName}
            color="primary"
            deleteIcon={<ChevronLeftIcon />} />
        {scheduledList.map((item, index) => (
            // @ts-ignore
            <Chip key={item.schedule_id} label={item.first + " " + item.last} deleteIcon={< PersonRemoveIcon />} onDelete={isAdmin && ((e) => {removeUserFromScheduled(item)})} />
        ))}
        {memberList.map((item, index) => (
            // @ts-ignore
            <Chip key={index}label={item.first + " " + item.last} onDelete={isAdmin && ((e) => {addUserToSchedule(index)})} deleteIcon={<PersonAddIcon />} />
        ))}        
        </>
    );



}