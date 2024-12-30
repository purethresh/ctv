import { Box, IconButton } from "@mui/material";
import { SMemberLabelProps } from "../props/SMemberLabelProps";
import { useEffect, useState } from 'react';
import { ScheduleStatus } from "../lib/ScheduleStatus";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function SLabelMember(props:SMemberLabelProps) {
    const memberColor:string = '#888888';
    const scheduledColor:string = '#ADD8E6';
    const blockedOutColor:string = '#FF7F7F';
    const recommendedColor:string = '#90EE90';

    let [memberId, setMemberId] = useState<string>('');
    let [memberInfo, setMemberInfo] = useState<MinMemberInfo>(props.memberInfo || new MinMemberInfo({}));
    let [fullName, setFullName] = useState<string>('');
    let [showStatus, setShowStatus] = useState<boolean>(props.showStatus || false);
    let [statusColor, setStatusColor] = useState<string>(memberColor);

    let [showAdd, setShowAdd] = useState<boolean>(false);
    let [showRemove, setShowRemove] = useState<boolean>(false);

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

            // Set the status
            const sStatus = props.showStatus || false;
            setShowStatus(sStatus);

            if (sStatus) {
                if (mInfo.scheduledStatus === ScheduleStatus.blockedOut) {
                    setStatusColor(blockedOutColor);
                } else if (mInfo.scheduledStatus === ScheduleStatus.recommended) {
                    setStatusColor(recommendedColor);
                } else if (mInfo.scheduledStatus === ScheduleStatus.scheduled) {
                    setStatusColor(scheduledColor);
                } else {
                    setStatusColor(memberColor);
                }
            }

            setShowAdd(props.addMember !== undefined && mInfo.scheduledStatus !== ScheduleStatus.blockedOut);
            setShowRemove(props.removeMember !== undefined);
        }
    }

    useEffect(() => {
        setupUserInfo();
    }, [props.memberInfo, props.updateNumber]);

    return (
        <Box sx={{backgroundColor: statusColor, display: 'inline-block', padding: '5px', margin: '5px', borderRadius: '15px'}}>
            {fullName}
            <IconButton aria-label="remove" onClick={onClickRemove} sx={{display: showRemove ? 'inline' : 'none'}}>
                <DeleteIcon/>
            </IconButton>
            <IconButton aria-label="add" onClick={onClickAdd} sx={{display: showAdd ? 'inline' : 'none'}}>
                <AddIcon/>
            </IconButton>
        </Box>
    );



}