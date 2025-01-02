import { Box, IconButton } from "@mui/material";
import { SMemberLabelProps } from "../props/SMemberLabelProps";
import { useEffect, useState } from 'react';
import { MinMemberInfo } from "../lib/MinMemberInfo";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from "@mui/material";

export default function SLabelMember(props:SMemberLabelProps) {
    let [memberId, setMemberId] = useState<string>('');
    let [memberInfo, setMemberInfo] = useState<MinMemberInfo>(props.memberInfo || new MinMemberInfo({}));
    let [fullName, setFullName] = useState<string>('');
    let [backColor, setBackColor] = useState<string>('secondary.main');
    let [textColor, setTextColor] = useState<string>('secondary.contrastText');

    let [showAdd, setShowAdd] = useState<boolean>(props.showAdd || false);
    let [showRemove, setShowRemove] = useState<boolean>(props.showRemove || false);

    const onClickAdd = () => {
        if (props.addMember) {
            props.addMember(memberInfo);
        }
    }

    const onClickRemove = () => {
        if (props.removeMember) {
            props.removeMember(memberInfo);
        }
    }   

    const setupUserInfo = () => {
        if (props.memberInfo !== undefined) {
            const mInfo = props.memberInfo;
            setMemberInfo(mInfo);
            setMemberId(props.memberInfo.member_id);

            // Set the name
            var nm = mInfo.first;
            if (mInfo.last.length > 0) {
                nm = mInfo.first + ' ' + mInfo.last;
            }
            setFullName(nm);

            // TODO JLS, need to use status to set the color

            // if (mInfo.scheduledStatus === ScheduleStatus.blockedOut) {
            //     setStatusColor(blockedOutColor);
            // } else if (mInfo.scheduledStatus === ScheduleStatus.recommended) {
            //     setStatusColor(recommendedColor);
            // } else if (mInfo.scheduledStatus === ScheduleStatus.scheduled) {
            //     setStatusColor(scheduledColor);
            // } else {
            //     setStatusColor(memberColor);
            // }
        }
    }

    useEffect(() => {
        setupUserInfo();
    }, [props.memberInfo, props.updateNumber]);

    return (
        <Box sx={{backgroundColor: backColor, display: 'inline-block', paddingLeft: '10px', paddingRight: '10px', paddingTop: '3px', paddingBottom: '2px', margin: '5px', borderRadius: '10px'}}>
            <Typography variant="button" sx={{color: textColor, display:'block'}}>{fullName}</Typography>
            <IconButton aria-label="remove" onClick={onClickRemove} sx={{display: showRemove ? 'inline' : 'none'}}>
                <DeleteIcon/>
            </IconButton>
            <IconButton aria-label="add" onClick={onClickAdd} sx={{display: showAdd ? 'inline' : 'none'}}>
                <AddIcon/>
            </IconButton>
        </Box>
    );



}