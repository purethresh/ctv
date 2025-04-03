import { Box, IconButton } from "@mui/material";
import { SMemberLabelProps } from "../props/SMemberLabelProps";
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from "@mui/material";
import { FullMemberInfo } from "../lib/FullMemberInfo";

export default function SLabelMember(props:SMemberLabelProps) {
    const defaultBackColor = 'warning.main';
    const defaultTextColor = 'warning.contrastText';
    const blockedBackColor = 'error.main';
    const blockedTextColor = 'error.contrastText';
    const recommendedBackColor = 'info.main';
    const recommendedTextColor = 'info.contrastText';
    const scheduledBackColor = 'success.main';
    const scheduledTextColor = 'success.contrastText';

    let [memberId, setMemberId] = useState<string>('');
    let [labelId, setLabelId] = useState<string>('');
    let [maxScheduledForRecommendation, setMaxScheduledForRecommendation] = useState<number>(props.maxScheduledForRecommendation || 1);
    let [memberInfo, setMemberInfo] = useState<FullMemberInfo>(props.memberInfo || new FullMemberInfo({}));
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
            var sAdd = props.showAdd || false;
            var sRemove = props.showRemove || false;
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

            const serviceDate = props.serviceDate || '';
            const serviceId = props.service_id || '';

            // Set the status
            if (mInfo.isBlockedOutForService(serviceDate)) {
                sAdd = false;
                setBackColor(blockedBackColor);
                setTextColor(blockedTextColor);
            }
            else if (mInfo.isScheduledForLabel(serviceId, lblId)) {
                setBackColor(scheduledBackColor);
                setTextColor(scheduledTextColor);
            }
            else if (mInfo.isRecommendedForLabel(serviceId, maxScheduledForRecommendation)) {
                setBackColor(recommendedBackColor);
                setTextColor(recommendedTextColor);
            }
            else if (mInfo.isScheduledForService(serviceId)) {
                // TODO JLS, need a new color for this.
                // Member is scheduled for a different label in this service
                setBackColor(scheduledBackColor);
                setTextColor(scheduledTextColor);
            }
            else {
                setBackColor(defaultBackColor);
                setTextColor(defaultTextColor);
            }

            // If blocked out, it could change the showAdd and showRemove
            setShowAdd(sAdd);
            setShowRemove(sRemove);
        }
    }

    useEffect(() => {
        setupUserInfo();
    }, [props.memberInfo]);

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