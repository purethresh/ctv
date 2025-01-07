import { Box, IconButton } from "@mui/material";
import { SMemberLabelProps } from "../props/SMemberLabelProps";
import { useEffect, useState } from 'react';
import { MinMemberInfo } from "../lib/MinMemberInfo";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from "@mui/material";
import { ScheduleStatus } from "../lib/ScheduleStatus";

export default function SLabelMember(props:SMemberLabelProps) {
    const defaultBackColor = 'info.main';
    const defaultTextColor = 'info.contrastText';
    const blockedBackColor = 'error.main';
    const blockedTextColor = 'error.contrastText';
    const recommendedBackColor = 'warning.main';
    const recommendedTextColor = 'warning.contrastText';
    const scheduledBackColor = 'success.main';
    const scheduledTextColor = 'success.contrastText';

    let [memberId, setMemberId] = useState<string>('');
    let [labelId, setLabelId] = useState<string>('');
    let [memberInfo, setMemberInfo] = useState<MinMemberInfo>(props.memberInfo || new MinMemberInfo({}));
    let [fullName, setFullName] = useState<string>('');
    let [backColor, setBackColor] = useState<string>(defaultBackColor);
    let [textColor, setTextColor] = useState<string>(defaultTextColor);

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

            setShowAdd(props.showAdd || false);
            setShowRemove(props.showRemove || false);
            const lblId = props.label_id || '';
            setLabelId(lblId);
            
            const mInfo = props.memberInfo;
            setMemberInfo(mInfo);
            setMemberId(props.memberInfo.member_id);

            // Set the name
            var nm = mInfo.first;
            if (mInfo.last.length > 0) {
                nm = mInfo.first + ' ' + mInfo.last;
            }
            setFullName(nm);

            if (mInfo.scheduledStatus === ScheduleStatus.blockedOut) {
                setBackColor(blockedBackColor);
                setTextColor(blockedTextColor);
            } else if (mInfo.scheduledStatus === ScheduleStatus.recommended) {
                setBackColor(recommendedBackColor);
                setTextColor(recommendedTextColor);
            } else if (mInfo.scheduledStatus === ScheduleStatus.scheduled) {
                if (mInfo.scheduledLabels.has(lblId)) {
                    setBackColor(scheduledBackColor);
                    setTextColor(scheduledTextColor);
                } else {
                    setBackColor(defaultBackColor);
                    setTextColor(defaultTextColor);
                }
            } else {
                setBackColor(defaultBackColor);
                setTextColor(defaultTextColor);
            }
        }
    }

    useEffect(() => {
        setupUserInfo();
    }, [props.memberInfo, props.updateNumber]);

    return (
        <Box sx={{backgroundColor: backColor, display: 'inline-flex', paddingLeft: '10px', paddingRight: '10px', paddingTop: '3px', paddingBottom: '2px', margin: '5px', borderRadius: '10px'}}>
            <Typography variant="button" sx={{color: textColor, display:'block'}}>{fullName}</Typography>
            <IconButton aria-label="remove" onClick={onClickRemove} sx={{display: showRemove ? 'inline' : 'none', height:'24px', marginTop:'-12px'}}>
                <DeleteIcon/>
            </IconButton>
            <IconButton aria-label="add" onClick={onClickAdd} sx={{display: showAdd ? 'inline' : 'none', height:'24px', marginTop:'-12px'}}>
                <AddIcon/>
            </IconButton>
        </Box>
    );



}